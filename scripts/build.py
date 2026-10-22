#!/usr/bin/env python3
"""Renderiza o template versionado, reutilizando ou substituindo os dados.

Mesmo modelo do explorador-prodes (22/10/2026): a página é
src/explorador_template.html; os dados (o objeto D) vêm do index.html publicado
ou de um JSON novo gravado pelo 04_explorador_html.py.

    python3 scripts/build.py            # template + dados do index.html -> index.html
    python3 scripts/build.py --check    # confere, sem gravar, que o index.html sai daqui
    python3 scripts/build.py --data D.json
"""
import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TEMPLATE = ROOT / 'src' / 'explorador_template.html'


def payload(html):
    match = re.search(r'^const D=(\{[^\n]+\});$', html, re.M)
    if not match:
        raise ValueError('HTML sem a linha "const D={...};" esperada')
    return match[1]


def render(template, data):
    if template.count('__DADOS__') != 1:
        raise ValueError('O template precisa conter exatamente um __DADOS__')
    return template.replace('__DADOS__', data, 1)


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--payload-from', type=Path, default=ROOT / 'index.html')
    parser.add_argument('--data', type=Path, help='JSON preparado pelo 04_explorador_html.py')
    parser.add_argument('--output', type=Path, default=ROOT / 'index.html')
    parser.add_argument('--check', action='store_true', help='Confere sem escrever arquivos')
    args = parser.parse_args()
    if args.data:
        data = json.dumps(json.loads(args.data.read_text()), ensure_ascii=False, separators=(',', ':'))
    else:
        data = payload(args.payload_from.read_text())
    html = render(TEMPLATE.read_text(), data)
    if args.check:
        if not args.output.exists() or args.output.read_bytes() != html.encode():
            raise SystemExit('index.html diverge do template; execute python3 scripts/build.py')
        print('HTML idêntico ao template + dados, byte a byte.')
    else:
        args.output.write_text(html)
        print(args.output)


if __name__ == '__main__':
    main()
