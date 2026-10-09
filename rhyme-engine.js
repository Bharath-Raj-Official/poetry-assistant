class RhymeEngine {
  constructor(text){this.words=new Map();this.groups=new Map();
    for(const line of text.split(/\r?\n/)){
      if(!line||line.startsWith(';;;'))continue;
      const [raw,...phones]=line.trim().split(/\s+/),word=raw.replace(/\(\d+\)$/,'').toLowerCase();
      if(!/^[a-z]+(?:'[a-z]+)?$/.test(word))continue;
      const count=phones.filter(p=>/[012]$/.test(p)).length;
      let index=-1;for(let i=phones.length-1;i>=0;i--)if(/[12]$/.test(phones[i])){index=i;break;}
      if(index<0)index=phones.findLastIndex(p=>/[0]$/.test(p));
      if(index<0)continue;
      const key=phones.slice(index).map(p=>p.replace(/[012]/g,'')).join(' ');
      const entry={word,count,key};if(!this.words.has(word))this.words.set(word,[]);this.words.get(word).push(entry);
      if(!this.groups.has(key))this.groups.set(key,[]);this.groups.get(key).push(entry);
    }
  }
  find(input,syllables=0){const word=input.trim().toLowerCase();const entries=this.words.get(word);if(!entries)return null;
    const found=new Map();for(const entry of entries)for(const candidate of this.groups.get(entry.key)){
      if(candidate.word!==word&&(!syllables||(syllables===4?candidate.count>=4:candidate.count===syllables)))found.set(candidate.word,candidate);
    }return [...found.values()].sort((a,b)=>a.count-b.count||a.word.localeCompare(b.word));
  }
}
if(typeof module!=='undefined')module.exports=RhymeEngine;
