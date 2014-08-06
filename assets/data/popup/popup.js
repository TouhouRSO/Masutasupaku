$(function() {
  var popupGenerator = {
    generate: function(e) {
      this.createPopupPage(e);
      this.createHeaderImage(e);
      this.createAudioButton(e);
      this.createMatchButton(e);
    },
    createPopupPage: function(e) {
      var html = e.getElementsByTagName("html")[0];
      html.style.height          = "150px";
      html.style.width           = "144px";
      html.style.backgroundColor = "#efefef";
    },
    createHeaderImage: function(e) {
      var img = e.createElement("img");
      img.setAttribute("alt"   , "Masutāsupāku"                   );
      img.setAttribute("height", "64px"                           );
      img.setAttribute("id"    , "headerImage"                    );
      img.setAttribute("src"   , "../../images/Hakkero128x64.png" );
      img.setAttribute("title" , "Masutāsupāku"                   );
      img.setAttribute("width" , "128px"                          );
      e.body.appendChild(img);
    },
    createAudioButton: function(e) {
      e.audioMute = false;
      var input = e.createElement("input");

      input.setAttribute("class" , "button green medium");
      input.setAttribute("alt"   , "Toggle Audio on/off");
      input.setAttribute("id"    , "audioButton"        );
      input.setAttribute("title" , "Toggle Audio on/off");
      input.setAttribute("type"  , "Submit"             );
      input.setAttribute("value" , "      Audio       " );

      input.style.marginTop = "8px";
      input.style.marginLeft = "10px";

      input.onclick = function() {
        if (document.audioMute) {
          input.setAttribute("class" , "button green medium");
        } else {
          input.setAttribute("class" , "button red medium");
        }
        document.audioMute = !document.audioMute;
      };

      e.body.appendChild(input);
    },
    createMatchButton: function(e) {
      var input = e.createElement("input");

      input.setAttribute("class" , "button orange medium");
      input.setAttribute("alt"   , "Find and join a game");
      input.setAttribute("id"    , "matchButton"         );
      input.setAttribute("title" , "Find and join a game");
      input.setAttribute("type"  , "Submit"              );
      input.setAttribute("value" , "Play a match"        );

      input.style.marginTop = "8px";
      input.style.marginLeft = "10px";

      e.body.appendChild(input);
    }
  };

  /* Execution */
  popupGenerator.generate(document);
  $("#matchButton").bind("click",function() {
    chrome.runtime.sendMessage({
      message: "match",
      info: [{"url": "http://dulst.com/touhourso/matches",title: "RumblingSpellOrchestra"}],
      setting: this.setting
    });
  });
});