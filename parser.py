# -*- coding: utf-8 -*-
from os.path import isfile
import hashlib
import pipes
import urllib2
from bs4 import BeautifulSoup
from bs4.element import Tag, NavigableString

def fetch(url):
    response = urllib2.urlopen(url)
    return response.read()

def kakasi(string):
    t = pipes.Template()
    t.append('kakasi -Ha -Ka -i utf-8', '--')
    f = t.open('pipes', 'w')
    f.write(string.encode('utf-8'))
    f.close()
    f = open('pipes')
    r = f.read()
    f.close()
    return r

def to_hiragana(string):
    t = pipes.Template()
    t.append('kakasi -KH -i utf-8 -o utf-8', '--')
    f = t.open('pipes', 'w')
    f.write(string.encode('utf-8'))
    f.close()
    return open('pipes').read().decode('utf-8')

def is_katakana(string):
    t = pipes.Template()
    t.append('kakasi -Ka -i utf-8 -o utf-8', '--')
    f = t.open('pipefile', 'w')
    f.write(string.replace(u'・', '').encode('utf-8'))
    f.close()
    try:
        open('pipefile').read().decode('ascii')
    except UnicodeDecodeError:
        return False
    else:
        return True

def strip(e):
    if isinstance(e, NavigableString):
        return unicode(e)
    return ''.join([strip(c) for c in e])

def get_kana(path):
    if path.startswith('http://dic.nicovideo.jp'):
        url = path
    else:
        url = 'http://dic.nicovideo.jp' + path
    dom = BeautifulSoup(fetch(url), 'html5lib')
    ps = dom.find('div', {'id': 'article'}).findAll('p', recursive=False)
    index = 0
    for p in ps:
        if strip(p).startswith(u'もしかして'):
            index += 1
    p = strip(ps[index])
    i1, i2 = p.find(u'（'), p.find(u'）')
    if i1 < 0 or i2 < 0:
        i1, i2 = p.find(u'('), p.find(u')')
        if i1 < 0 or i2 < 0:
            print p
            return ''
    return p[i1+1:i2]

def parse(table, attr):
    print attr
    obj1 = []
    obj2 = {}
    for tr in table.findAll('tr')[2:]:
        idol, first, prod, rest = [e for e in tr if e.name is not None]
        if is_katakana(idol.string):
            kana = to_hiragana(idol.string.replace(u'・', ' '))
        else:
            kana = to_hiragana(get_kana(idol.a['href']).replace(u'　', ''))
        roma = kakasi(kana)
        name = idol.string
        obj1.append({'name': name, 'kana': kana, 'roma': roma, 'attr': attr})
        obj2[name] = {}
        print name, kana, roma
        for other in strip(rest).replace(u'　', '').replace(' ', '').split('\n'):
            index = other.find(u'→')
            obj2[name][other[:index]] = other[index+1:]
    return obj1, obj2

def main():
    dom = BeautifulSoup(fetch('http://dic.nicovideo.jp/a/アイドルマスター%20シンデレラガールズ%3A呼称表'), 'html5lib')
    cute, cool, pasn, rest = dom.find('div', {'id', 'article'}).findAll('table', recursive=False)

    cute1, cute2 = parse(cute, 'cute')
    cool1, cool2 = parse(cool, 'cool')
    pasn1, pasn2 = parse(pasn, 'pasn')
    rest1, rest2 = parse(rest, 'rest')

    with open('list.json', 'wb') as f:
        print >>f, '['
        for idol in cute1 + cool1 + pasn1 + rest1:
            print >>f, '  {'
            print >>f, '    "name": "{}",'.format(idol['name'].encode('utf-8'))
            print >>f, '    "kana": "{}",'.format(idol['kana'].encode('utf-8'))
            print >>f, '    "roma": "{}",'.format(idol['roma'])
            print >>f, '    "type": "{}"'.format( idol['attr'])
            print >>f, '  },'
        print >>f, ']'

    with open('table.json', 'wb') as f:
        print >>f, '{'
        for k, d in {k: v for d in [cute2, cool2, pasn2, rest2] for k, v in d.items()}.items():
            print >>f, '"{}": {{'.format(k.encode('utf-8'))
            for i, v in d.items():
                print >>f, '"{}": "{},"'.format(i.encode('utf-8'), v.encode('utf-8'))
            print >>f, '},'
        print >>f, '}'

if __name__ == '__main__':
    main()
