const $=id=>document.getElementById(id);let engine,pending;
function status(text){$('status').textContent=text;}
function reference(){const previous=$('reference').value;$('reference').replaceChildren();$('poem').value.split('\n').forEach((line,i)=>{const option=document.createElement('option');option.value=i;option.textContent=`${i+1}: ${line.slice(0,45)||'(empty line)'}`;$('reference').append(option);});if([...$('reference').options].some(o=>o.value===previous))$('reference').value=previous;}
function search(){if(!engine)return;const word=$('word').value.trim(),matches=engine.find(word,Number($('syllables').value));$('results').replaceChildren();
  if(matches===null){status(`“${word}” is not in the dictionary. Try another word or pronunciation.`);return;}
  status(matches.length?`${matches.length} phonetic matches. Select a word to preview it in your poem.`:'No matches at this syllable length. Try Any length.');
  for(const match of matches.slice(0,250)){const b=document.createElement('button');b.textContent=match.word;b.title=`${match.count} syllable${match.count===1?'':'s'}`;b.onclick=()=>{
    const original=$('poem').value;if(!original.includes('[?]')){status(`Selected “${match.word}”. Add [?] to your poem to preview a replacement.`);return;}
    pending={original,result:original.replace('[?]',match.word)};$('preview-text').textContent=pending.result;$('preview').hidden=false;
  };$('results').append(b);}
}
$('search').onsubmit=e=>{e.preventDefault();search();};$('syllables').onchange=search;$('poem').oninput=()=>{reference();pending=null;$('preview').hidden=true;};
$('from-line').onclick=()=>{const line=$('poem').value.split('\n')[Number($('reference').value)]||'',word=line.match(/[a-z]+(?:'[a-z]+)?(?=[^a-z]*$)/i)?.[0];if(!word){status('Choose a reference line ending in an English word.');return;}$('word').value=word;search();};
$('sample').onclick=()=>{$('poem').value='The windows hold the evening light\nA quiet room, a page of [?]\nI leave a space and write again\nUntil the sound becomes a friend';reference();$('reference').value='0';$('word').value='light';search();};
$('apply').onclick=()=>{if(pending&&$('poem').value===pending.original){$('poem').value=pending.result;reference();}pending=null;$('preview').hidden=true;};$('cancel').onclick=()=>{pending=null;$('preview').hidden=true;};reference();
fetch('data/cmudict.dict').then(r=>{if(!r.ok)throw Error();return r.text();}).then(text=>{engine=new RhymeEngine(text);search();}).catch(()=>{status('Dictionary could not load. Serve this folder over HTTP and refresh.');});
