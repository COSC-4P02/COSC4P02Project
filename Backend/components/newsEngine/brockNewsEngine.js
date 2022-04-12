let { PythonShell } = require("python-shell");

// Brock News

module.exports = function (print, errorlog, query, result) {
  let options = {
    mode: "text",
    pythonOptions: ["-u"],
  };

  let pyshell = new PythonShell("./components/newsEngine/news.py", options);

  pyshell.send(query);
  pyshell.send("NLTK_EXIT");

  pyshell.on("message", function (message) {
    if (message.includes("BOT:")) {
      const msg = message.substring(4, message.length);
      if (msg == "Ready") {
        print("Py: Ready");
      } else if (msg == "NLTK_NOTFOUND") {
        print("Py: notfound");
        result("notfound");
      } else {
        print("Py: Answer | " + msg);
        result(message.substring(4, message.length));
      }
    }
    if (message.includes("ERR:")) {
      errorlog(message.substring(4, message.length));
    }
  });

  pyshell.end(function (err, code, signal) {
    if (err) {
      errorlog(err);
      result("notfound");
      print(
        "Py: The exit code was: " + code + "| The exit signal was: " + signal
      );
    }
  });
};
