import { generateCommand, maskLink, parseLink, withQueryParameters } from './link-utils';

describe('link utilities',()=>{
  test('requires a scheme and preserves invalid input',()=>{expect(parseLink('example.com/a')).toEqual({valid:false,message:'Add a URL scheme, such as https:// or myapp://.'});});
  test('parses duplicate parameters in order',()=>{const parsed=parseLink('https://example.com/a?tag=one&tag=two#details');expect(parsed.valid&&parsed.params.map(p=>[p.key,p.value])).toEqual([['tag','one'],['tag','two']]);});
  test('serializes ordered parameters',()=>{expect(withQueryParameters('https://example.com/a#x',[{id:'1',key:'q',value:'hello world'},{id:'2',key:'q',value:'again'}])).toBe('https://example.com/a?q=hello+world&q=again#x');});
  test('masks configured parameter names only',()=>{expect(maskLink('https://x.test?a=1&token=secret',['token'])).toContain('token=%E2%80%A2%E2%80%A2%E2%80%A2%E2%80%A2');});
  test('quotes apostrophes safely in commands',()=>{expect(generateCommand("myapp://x?q=it's",'ios')).toBe(`xcrun simctl openurl booted 'myapp://x?q=it'"'"'s'`);});
});
