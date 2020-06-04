#!/usr/bin/env node

const libxmljs = require("libxmljs");
const fs = require('fs')

const an2md = (xmlData) => {
  const debateSection = xmlDoc.get('//debateSection');
  const heading = debateSection.get('//heading').text().trim();
  let info = ''
  let colon = ''
  if (CheckEn(heading) === true) {
    info = `:::info\n🌐 This is a collaborative editor for the meeting transcript. If you want to adjust your own speech, please click on the "Pencil" icon at the top left corner to start editing. The system automatically saves each edit. It is scheduled to be released on 2020-01-09 and will be published at https://pdis.nat.gov.tw/track/ to the [public domain](https://github.com/audreyt/archive.tw/blob/gh-pages/LICENSE). Thank you for your contribution to the commons.\n:::\n\n`
    colon = ':'
  } else {
    info = `【說明】\n\n:::info\n🏡此為逐字稿共筆頁面，如有任何欲調整自己發言之文字，敬請直接點選於此頁面左上方圖示「筆」進行編修，呈現黑底畫面即可直接編寫，內容無須存檔，系統會自動保存。預定於於10年年月月1日公開，將公開於於 https://pdis.nat.gov.tw/track/ ，非常感謝。\n:::\n\n【以下開始記錄】\n\n`
    colon = '：'
  }
  let md = `# ${heading}\n\n` + info

  debateSection.childNodes().map(child => {
    switch (child.name()) {
      case 'speech':
        const speaker = child.attr('by').value().replace('#', '')
        const content = child.text().trim()
        const speech = `### ${speaker}${colon}\n${content}\n\n`
        md += speech
        break
      case 'narrative':
        let narrative = ''
        let text = ''
        let source = child.toString().match(/<i>(.*?)<\/i>/gs)[0]
        if (/<a href="/.test(source)) {
          source.match(/<a(.*?)<\/a>/gs).map(s => {
            let link = `[${s.match(/">(.*?)<\/a>/gs)[0].replace(/">/, '').replace(/<\/a>/, '').trim()}](${s.match(/<a href="(.*?)">/)[1]}) `
            source = source.replace(s, link)
          })
          text = source.replace(/<i>/, '').replace(/<\/i>/, '').replace(/\s/g, '')
          narrative = `> ${text}\n\n`
        } else {
          text = child.text().trim()
          narrative = `> ${text}\n\n`
        }
        md += narrative
        break
    }
  })
  fs.writeFileSync(process.argv[3], md)
}

const CheckEn = (str) => {
  const reg = /^[a-zA-Z0-9$@$!%*?&#^\-_. +]+$/
  return reg.test(str)
}

const xml = fs.readFileSync(process.argv[2], 'utf-8')
const xmlDoc = libxmljs.parseXml(xml);
an2md(xmlDoc)