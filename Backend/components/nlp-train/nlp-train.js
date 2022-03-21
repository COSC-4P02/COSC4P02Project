const fs = require('fs');
const trainGeneral = require('./nlp-train-general');
const trainBrock = require('./nlp-train-brock');
const trainGame = require('./nlp-train-game');

module.exports = async function trainnlp(manager, say, dbCache, version) {
  if (fs.existsSync(__dirname + '/../../data/nlp-model/model-' + version + '.nlp')) {
    manager.load(__dirname + '/../../data/nlp-model/model-' + version + '.nlp');
    return;
  }
  
  await trainGeneral(manager);

  if (version == "brock")
    trainBrock(manager,say,dbCache,function () {
      trainAndSave(manager,say,version);
    });

  if (version == "game")
    trainGame(manager,say,dbCache,function () {
      trainAndSave(manager,say,version);
    });

}

function trainAndSave(manager,say,version){
  const hrstart = process.hrtime();
  manager.train();
  const hrend = process.hrtime(hrstart);
  say("NlpTrainer: " + version + ' version trained (hr): ' + hrend[0] + " " + hrend[1] / 1000000);
  //manager.save('./data/nlp-model/model-' + version + '.nlp', true);
}
