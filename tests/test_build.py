import importlib.util
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('build', ROOT / 'scripts' / 'build.py')
build = importlib.util.module_from_spec(spec)
spec.loader.exec_module(build)


class BuildTests(unittest.TestCase):
    def test_publication_is_reproducible(self):
        original = (ROOT / 'index.html').read_text()
        self.assertEqual(build.render(build.TEMPLATE.read_text(), build.payload(original)), original)

    def test_requires_unambiguous_placeholder(self):
        with self.assertRaises(ValueError):
            build.render('__DADOS__ __DADOS__', '{}')

    def test_does_not_interpret_data_as_template_code(self):
        data = '{"texto":"<script>$HOME __DADOS__</script>"}'
        self.assertEqual(build.render('const D=__DADOS__;', data), f'const D={data};')


if __name__ == '__main__':
    unittest.main()
