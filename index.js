const parser = require('fast-xml-parser')
const fs = require('fs')

const [, , ...args] = process.argv

const options = {
  attributeNamePrefix: "",
  attrNodeName: "attr",
  textNodeName: "#text",
  ignoreAttributes: false,
  ignoreNameSpace: false,
  allowBooleanAttributes: false,
  parseNodeValue: true,
  parseAttributeValue: true,
  trimValues: true,
  cdataTagName: "__cdata",
  cdataPositionChar: "\\c",
  parseTrueNumberOnly: false,
  arrayMode: false,
};

const an2md = (xmlData) => {
  if (parser.validate(xmlData) === true) {
    const jsonObj = parser.parse(xmlData, options);
    const head = jsonObj.akomaNtoso.debate.debateBody.debateSection.heading
    const speeches = jsonObj.akomaNtoso.debate.debateBody.debateSection.speech

    const info = `【說明】\n\n:::info\n🏡此為逐字稿共筆頁面，如有任何欲調整自己發言之文字，敬請直接點選於此頁面左上方圖示「筆」進行編修，呈現黑底畫面即可直接編寫，內容無須存檔，系統會自動保存。預定於於10年年月月1日公開，將公開於於 https://pdis.nat.gov.tw/track/ ，非常感謝。\n:::\n\n【以下開始記錄】\n\n`
    let md = `# ${head}\n\n`
    md += info

    speeches.map(s => {
      const speaker = s.attr.by.replace('#', '')
      const content = s.p
      const speech = `### ${speaker}：\n${content}\n\n`
      md += speech
    })
    return md
  }
}

process.stdin.setEncoding('utf8').on('data', data => {
  process.stdout.write(an2md(data.toString()))
})