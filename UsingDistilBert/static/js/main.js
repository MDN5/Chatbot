$(function () {
  var INDEX = 0;
  var startup_counter = 1;
  $(".chat-box-refresh").hide();
  setCookie("latitude", "undefined", "1");
  setCookie("longitude", "undefined", "1");

  var error_message_en = "Apologies for the inconvenience caused by our error! We're working to fix it. Thank you for your understanding. :(";
  var error_message_fr = "Toutes nos excuses pour la gêne occasionnée par notre erreur ! Nous travaillons à le réparer. Merci pour votre compréhension. : (";
  var error_message_de = "Wir entschuldigen uns für die durch unseren Fehler entstandenen Unannehmlichkeiten! Wir arbeiten daran, das Problem zu beheben. Danke für Ihr Verständnis. : (";
  var error_message_jp = "弊社のミスによりご迷惑をおかけして申し訳ございませんでした。 現在修正に取り組んでいます。 ご理解のほどよろしくお願いいたします。:(";
  var error_message_ta ="எங்கள் பிழையால் ஏற்பட்ட சிரமத்திற்கு மன்னிக்கவும்! அதை சரிசெய்யும் பணியில் ஈடுபட்டுள்ளோம். நீங்கள் புரிந்து கொண்டதற்கு நன்றி. :("

  var good_bye_message_en =  "Thanks for reaching out! Hope we've resolved your queries. Have a great day!";
  var good_bye_message_fr =  "Merci d'avoir contacté ! J'espère que nous avons résolu vos questions. Passe une bonne journée!";
  var good_bye_message_de = "Vielen Dank für Ihre Kontaktaufnahme! Ich hoffe, wir haben Ihre Fragen gelöst. Ich wünsche ihnen einen wunderbaren Tag!";
  var good_bye_message_jp = "ご連絡いただきありがとうございます。 ご質問が解決できれば幸いです。 すてきな一日を！";
  var good_bye_message_ta = "சென்றடைந்ததற்கு நன்றி! உங்கள் கேள்விகளைத் தீர்த்துவிட்டோம் என்று நம்புகிறேன். இந்த நாள் இனிதாகட்டும்!";

  
  var conversation_msg_en = "Hello! Welcome to our support chatbot. How can I help you today?";
  var conversation_msg_fr = "Bonjour! Bienvenue sur notre chatbot d'assistance. Comment puis-je vous aider aujourd'hui?";
  var conversation_msg_de = "Hallo! Willkommen bei unserem Support-Chatbot. Wie kann ich Ihnen heute helfen?";
  var conversation_msg_ja = "こんにちは！ サポート チャットボットへようこそ。 今日はなんか手伝うことある？";
  var conversation_msg_ta =  "வணக்கம்! எங்கள் ஆதரவு chatbotக்கு வரவேற்கிறோம். இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?"  


  var assist_msg_en = "Is there anything else I can assist you with?";
  var assist_msg_fr = "Y a-t-il autre chose que je puisse faire pour vous aider ?";
  var assist_msg_de = "Kann ich Ihnen sonst noch mit irgendetwas helfen?";
  var assist_msg_ja = "「他に何かお手伝いできることはありますか？";
  var assist_msg_ta = "நான் உங்களுக்கு உதவ வேறு ஏதாவது இருக்கிறதா?";

  var satisfy_msg_en = "Are you satisfied with the assistance provided?";
  var satisfy_msg_fr = "Etes-vous satisfait de l’assistance apportée ?";
  var satisfy_msg_de = "Sind Sie mit der geleisteten Hilfe zufrieden?";
  var satisfy_msg_ja = "提供された支援に満足していますか?";
  var satisfy_msg_ta = "வழங்கப்பட்ட உதவியில் நீங்கள் திருப்தியடைகிறீர்களா?";

  var button_option_msg_en = "Here are some ways you can engage and interact with me:";
  var button_option_msg_fr = "Voici quelques façons dont vous pouvez vous engager et interagir avec moi :";
  var button_option_msg_de = "Hier sind einige Möglichkeiten, wie Sie mit mir in Kontakt treten und interagieren können:";
  var button_option_msg_ja = "私と関わり、対話できる方法は次のとおりです。";
  var button_option_msg_ta = "நீங்கள் என்னுடன் ஈடுபடவும் தொடர்பு கொள்ளவும் சில வழிகள் உள்ளன:";

  
  /* Check Mobile */
  var isMobile = false; //initiate as false
  // device detection
  if ($(window).height() < 1000 && $(window).width() < 700) {
    isMobile = true;
  }

  /* Clear chats */
  $(".chat-box-refresh").click(function () {
    $(".chat-logs").empty();
    getMenu("startup");
  });

  /* User Location */
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        // Success function
        showPosition,
        // Error function
        null,
        // Options. See MDN for details.
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  function showPosition(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    setCookie("latitude", latitude, "1");
    setCookie("longitude", longitude, "1");
  }

  window.onload = getLocation();

  /* Set Cookie Values */
  function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  /* Get Cookie Values */
  function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  /* Toggle Chat Box*/
  $("#chat-circle").click(function () {
    if (isMobile) {
      $(".chat-box").css({
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
      });
      $("#chat-circle").toggle("scale");
      $(".chat-box").toggle("scale");
      validateCookie();
    } else {
      $("#chat-circle").toggle("scale");
      $(".chat-box").toggle("scale");
      validateCookie();
    }
  });

  /* Validate Cookie */
  function validateCookie() {
    var name = getCookie("name");
    var email = getCookie("email");
    var mobile = getCookie("mobile");
    if (name == "" && email == "" && mobile == "") {
      $(".chat-box-form").show();
      $(".chat-box-body").hide();
      $(".chat-input").hide();
      $(".chat-input button").hide();
    } else {
      $(".chat-box-body").show();
      $(".chat-input").show();
      $(".chat-input button").show();
      $(".chat-box-refresh").show();
      $(".chat-box-form").hide();
      if (startup_counter == 1) {
        getMenu("startup");
        startup_counter++;
      }
    }
  }

  $(".chat-box-toggle").click(function () {
    $("#chat-circle").toggle("scale");
    $(".chat-box").toggle("scale");
  });

  /* User Message */
  function user_message(msg) {
    var str = "";
    str += "<div id='cm-msg-user-" + INDEX + "' class='chat-msg user'>";
    str += "          <div class='cm-msg-text'>";
    str += msg;
    str += "          </div>";
    str += "        </div>";
    $(".chat-logs").append(str);
    $("#cm-msg-user-" + INDEX.toString())
      .hide()
      .fadeIn(1000);
    $(".chat-logs")
      .stop()
      .animate({ scrollTop: $(".chat-logs")[0].scrollHeight }, 1000);
    INDEX++;
  }

  /* Bot Message */
  function bot_message(msg) {
    var str = "";
    str += "<div id='cm-msg-bot-" + INDEX + "' class='chat-msg bot'>";
    str += "          <span class='msg-avatar'>";
    str += "            <img src='static/img/chatbot.png'>";
    str += "          </span>";
    str += "          <div class='cm-msg-text reply'>";
    str += msg;
    str += "          </div>";
    str += "        </div>";
    $(".chat-logs").append(str);
    $("#cm-msg-bot-" + INDEX.toString())
      .hide()
      .fadeIn(1000);
    $(".chat-logs")
      .stop()
      .animate({ scrollTop: $(".chat-logs")[0].scrollHeight }, 1000);
    INDEX++;
  }

  /* Bot typing  */
  function bot_typing() {
    var str = "";
    str +=
      "<div id='bot-typing-" + INDEX + "' class='chat-msg bot bot-typing'>";
    str += "          <span class='msg-avatar'>";
    str += "            <img src='static/img/chatbot.png'>";
    str += "          </span>";
    str += "          <div class='cm-msg-text'>";
    str += "          <div id='circleWrapper'>";
    str += "            <div class='circle' id='circle1'></div>";
    str += "            <div class='circle' id='circle2'></div>";
    str += "            <div class='circle' id='circle3'></div>";
    str += "          </div>";
    str += "          </div>";
    str += "        </div>";
    $(".chat-logs").append(str);
    $("#bot-typing-" + INDEX.toString())
      .hide()
      .fadeIn(1000);
    $(".chat-logs")
      .stop()
      .animate({ scrollTop: $(".chat-logs")[0].scrollHeight }, 1000);
    INDEX++;
  }

  /* Bot Links */
  function bot_links(msg) {
    var str = "";
    str += "<div id='cm-msg-bot-links-" + INDEX + "' class='chat-msg bot'>";
    str += msg;
    str += "</div>";
    $(".chat-logs").append(str);
    $("#cm-msg-bot-links-" + INDEX.toString())
      .hide()
      .fadeIn(1000);
    $(".chat-logs")
      .stop()
      .animate({ scrollTop: $(".chat-logs")[0].scrollHeight }, 1000);
    INDEX++;
  }
  /* Get Menu */
  function getMenu(type = "conversation") {
    var lan_name = "conversation_msg_" + getCookie("language").replace("-", "_");
    var menu_msg_en =
      "Hello " +
      getCookie("name") +
      " ,Welcome! How can I assist you today?";

    var menu_msg_fr =
      "Bonjour " +
      getCookie("name") +
      "! Comment puis-je vous aider aujourd'hui ?";

    var menu_msg_ge = 
      "Hallo " +
      getCookie("name") +
      "！wie kann ich Ihnen heute helfen？";

    var menu_msg_ch = "您好 " +
      getCookie("name") +
      "！今天需要什么帮助吗？";

    var menu_msg_ja = "こんにちは、" +
      getCookie("name") +
      "! さん、今日はどのようなお手伝いをさせていただけますか?";

    var menu_msg_ta = "வணக்கம் " +
      getCookie("name") +
      "! இன்று நான் உங்களுக்கு எப்படி உதவுவது?";

    var startup_lan = "menu_msg_" + getCookie("language").replace("-", "_");
    var str = "";
    if (type == "startup") {
      str +=
        "<div id='cm-msg-menu-startup-" + INDEX + "' class='chat-msg bot'>";
      str += "  <span class='msg-avatar'>";
      str += "    <img src='static/img/chatbot.png' />";
      str += "  </span>";
      str += "  <div class='cm-msg-text'>";
      str += eval(startup_lan);
      str += "  </div>";
      
      str += "  <div class='cm-msg-button'>";
      str += "    <ul>";
      str += "      <li>";
      str +=
        "          <button class='btn btn-sm btn-outline-primary general-form'>General</button>";
      str += "      </li>";
      str += "      <li>";
      str +=
        "          <button class='btn btn-sm btn-outline-primary technical-form'>Technical</button>";
      str += "      </li>";
      str += "      <li>";
      str +=
        "          <button class='btn btn-sm btn-outline-primary language-change'>Change language</button>";
      str += "      </li>";
      str += "    </ul>";
      str += "  </div>";

      str += "</div>";
      $(".chat-logs").append(str);
      $("#cm-msg-menu-startup-" + INDEX.toString())
        .hide()
        .fadeIn(1000);
      $(".chat-logs")
        .stop()
        .animate({ scrollTop: $(".chat-logs")[0].scrollHeight }, 1000);
      speak(eval(startup_lan));
      INDEX++;
    } else {
      str +=
        "<div id='cm-msg-menu-conversation-" +
        INDEX +
        "' class='chat-msg bot'>";
      str += "  <span class='msg-avatar'>";
      str += "    <img src='static/img/chatbot.png' />";
      str += "  </span>";
      str += "  <div class='cm-msg-text'>";
      str += eval(lan_name);
      str += "  </div>";
      
      str += "  <div class='cm-msg-button'>";
      str += "    <ul>";
      str += "      <li>";
      str +=
        "          <button class='btn btn-sm btn-outline-primary general-form'>General</button>";
      str += "      </li>";
      str += "      <li>";
      str +=
        "          <button class='btn btn-sm btn-outline-primary technical-form'>Technical</button>";
      str += "      </li>";
      str += "      <li>";
      str +=
        "          <button class='btn btn-sm btn-outline-primary language-change'>Change language</button>";
      str += "      </li>";
      str += "    </ul>";
      str += "  </div>";

      str += "</div>";
      $(".chat-logs").append(str);
      $("#cm-msg-menu-conversation-" + INDEX.toString())
        .hide()
        .fadeIn(1000);
      $(".chat-logs")
        .stop()
        .animate({ scrollTop: $(".chat-logs")[0].scrollHeight }, 1000);
      speak(eval(lan_name));
      var lan_name = "conversation_msg_" + getCookie("language").replace("-", "_");
      INDEX++;
    }

    $(".language-change").on("click", function (e) {
      e.preventDefault();
      var str = "";
      str += "<div id='language-change-" + INDEX + "' class='chat-msg bot'>";
      str += "          <span class='msg-avatar'>";
      str += "            <img src='static/img/chatbot.png'>";
      str += "          </span>";
      str += "          <div class='cm-msg-text'>";
      str += "             <label for='Language'>Choose Language</label>";
      str += "             <select class='form-control language_change' id='language-change-select-" + INDEX + "' name='language' required>";
      str += "              <option value=''>Select language</option>";
      str += "              <option value='en'>English</option>";
      str += "              <option value='hi'>French</option>";
      str += "              <option value='zh-cn'>German</option>";
      str += "              <option value='es'>Japanese</option>";
      str += "              <option value='fr'>Tamil</option>";
      str += "            </select>";
      str += "             </div>";
      str += "          </div>";
      str += "        </div>";
      
      $(".chat-logs").append(str);
      $('#language-change-select-' + INDEX.toString()).val(getCookie("language"));
      $("#language-change-" + INDEX.toString())
        .hide()
        .fadeIn(1000);
      $(".chat-logs")
        .stop()
        .animate({ scrollTop: $(".chat-logs")[0].scrollHeight }, 1000);
      INDEX++;

      $(".language_change")
        .unbind()
        .change(function (e) {
          e.preventDefault();
          if ($(this).val() != getCookie("language")) {
            setCookie("language", $(this).val(), "en");
            $(".language_change").attr("disabled", "disabled");
            var lan_name_change = "assist_msg_" + getCookie("language").replace("-", "_");
            bot_message("Your language has changed to " + $(".language_change option:selected:last").text());
            bot_message(eval(lan_name_change));
              assistanceButton();
            speak("Your language has changed to " + $(".language_change option:selected:last").text());
            speak(eval(lan_name_change));
            
          } else {
            $(".language_change").attr("disabled", "disabled");
            var lan_name_change = "assist_msg_" + getCookie("language").replace("-", "_");
              bot_message("Your chosen language is already " + $(".language_change option:selected:last").text());
            bot_message(eval(lan_name_change));
              assistanceButton();
            speak("Your chosen language is already " + $(".language_change option:selected:last").text());
            speak(eval(lan_name_change));
          }
        });
    });

    /* General query Form */
    $(".general-form").on("click", function (e) {
      e.preventDefault();
      general_form_generate();
    });

    /* General query Form */
    $(".technical-form").on("click", function (e) {
      e.preventDefault();
      technical_form_generate();
    });

  }

  function getDate() {
    var today = new Date();
    return (
      today.getFullYear() +
      "-" +
      ("0" + (today.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + today.getDate()).slice(-2)
    );
  }

  /* General form generate */
  function general_form_generate() {
    var button_lan = "button_option_msg_" + getCookie("language").replace("-", "_");
    var str = "";
    str += "<div id='general-form-" + INDEX + "' class='chat-msg bot'>";
    str += "          <span class='msg-avatar'>";
    str += "            <img src='static/img/chatbot.png'>";
    str += "          </span>";
    str += "          <div class='cm-msg-text'>";
    // str += "Please select from the following";
    str += eval(button_lan);
    str += "  </div>";

    str += "  <div class='cm-msg-button'>";
    str += "    <ul>";
    str += "      <li>";
    str +=
      "          <button class='btn btn-sm btn-outline-primary Functions '>About Features / Functionalities </button>";
    str += "      </li>";
    str += "      <li>";
    str +=
      "          <button class='btn btn-sm btn-outline-primary class'>Usage</button>";
    str += "      </li>";
    str += "      <li>";
    str +=
      "          <button class='btn btn-sm btn-outline-primary resume'>Related Documentation</button>";
    str += "      </li>";
    str += "      <li>";
    str +=
    str += "    </ul>";
    str += "  </div>";
    str += "        </div>";
    $(".chat-logs").append(str);
    $("#general-form-" + INDEX.toString())
      .hide()
      .fadeIn(1000);
    $(".chat-logs")
      .stop()
      .animate({ scrollTop: $(".chat-logs")[0].scrollHeight }, 1000);
    speak(eval(button_lan));
    INDEX++;

    /* Functions form generate */
    $(".Functions").on("click", function (e) {
      e.preventDefault();
      course_form_generate();
    });

    /* class form generate */
    $(".class").on("click", function (e) {
      e.preventDefault();
      class_form_generate();
    });
    
  }

  /* Technical form generate */
  function technical_form_generate() {
    var button_lan = "button_option_msg_" + getCookie("language").replace("-", "_");
    var str = "";
    str += "<div id='technical-form-" + INDEX + "' class='chat-msg bot'>";
    str += "          <span class='msg-avatar'>";
    str += "            <img src='static/img/chatbot.png'>";
    str += "          </span>";
    str += "          <div class='cm-msg-text'>";
    // str += "Please select from the following";
    str += eval(button_lan);
    str += "  </div>";

    str += "  <div class='cm-msg-button'>";
    str += "    <ul>";
    str += "      <li>";
    str +=
      "          <button class='btn btn-sm btn-outline-primary Request Assistance'>Request Assistance</button>";
    str += "      </li>";
    str += "      <li>";
    str +=
      "          <button class='btn btn-sm btn-outline-primary others_technical'>Others</button>";
    str += "      </li>";
    str += "    </ul>";
    str += "  </div>";
    str += "        </div>";
    $(".chat-logs").append(str);
    $("#technical-form-" + INDEX.toString())
      .hide()
      .fadeIn(1000);
    $(".chat-logs")
      .stop()
      .animate({ scrollTop: $(".chat-logs")[0].scrollHeight }, 1000);
    speak(eval(button_lan));
    INDEX++;

    /* others_technical form generate */
    $(".others_technical").on("click", function (e) {
      e.preventDefault();
      others_technical_form_generate();
    });

  }

  // others_technical_form_generate
  function others_technical_form_generate() {
    var str = "";
    str += "<div id='others_technical-query-form-" + INDEX + "' class='chat-msg bot'>";
    str += "          <span class='msg-avatar'>";
    str += "            <img src='static/img/chatbot.png'>";
    str += "          </span>";
    str += "          <div class='cm-msg-text'>";
    str +=
      "           <form id='others_technical-query-form' name='technical-query-form' class='others_technical-query-generate-form' method='POST'>";
    str +=
      "               <p>To proceed forward please enter your technical query:</p>";
    str += "               <div class='form-row'>";
    str += "                  <div class='form-group'>";
    str += "                   <label for='topic'>Technical Query</label>";
    str +=
      "                      <input type='text' id='others_technical-query-" + INDEX + "' class='form-control others_technical-query'  name='query' value='' required/>";
    str += "                  </div>";
    str += "             </div>";
    str +=
      "             <button type='submit' class='btn btn-primary form-submit' >Submit </button>";
    str += "           </form>";
    str += "          </div>";
    str += "        </div>";
    $(".chat-logs").append(str);
    $("others_technical-query-form-" + INDEX.toString())
      .hide()
      .fadeIn(1000);
    $(".chat-logs")
      .stop()
      .animate({ scrollTop: $(".chat-logs")[0].scrollHeight }, 1000);

    INDEX++;
  }

/* Functions form generate */
  function course_form_generate() {
    var button_lan = "button_option_msg_" + getCookie("language").replace("-", "_");
    var str = "";
    str += "<div id='Functions-form-" + INDEX + "' class='chat-msg bot'>";
    str += "          <span class='msg-avatar'>";
    str += "            <img src='static/img/chatbot.png'>";
    str += "          </span>";
    str += "          <div class='cm-msg-text'>";
    str += eval(button_lan);
    str += "  </div>";

    str += "  <div class='cm-msg-button'>";
    str += "    <ul>";
    str += "      <li>";
    str +=
      "          <button class='btn btn-sm btn-outline-primary Functions-details'>Filters, Drill-downs, and Visualizations</button>";
    str += "      </li>";
    str += "      <li>";
    str +=
      "          <button class='btn btn-sm btn-outline-primary Functions-registration'>Dummy - FF</button>";
    str += "      </li>";
    str += "    </ul>";
    str += "  </div>";
    str += "        </div>";
    $(".chat-logs").append(str);
    $("#Functions-form-" + INDEX.toString())
      .hide()
      .fadeIn(1000);
    $(".chat-logs")
      .stop()
      .animate({ scrollTop: $(".chat-logs")[0].scrollHeight }, 1000);
    speak(eval(button_lan));
    INDEX++;

    /* Functions-details form generate */
    $(".Functions-details").on("click", function (e) {
      e.preventDefault();
      course_details_form_generate();
    });

    /* Functions-details form generate */
    $(".Functions-registration").on("click", function (e) {
      e.preventDefault();
      course_registration_form_generate();
    });

  }

  /* Filters, Drill-downs, and Visualizations form generate */
  function course_details_form_generate() {
    var button_lan = "button_option_msg_" + getCookie("language").replace("-", "_");
    var str = "";
    str += "<div id='Functions-details-form-" + INDEX + "' class='chat-msg bot'>";
    str += "          <span class='msg-avatar'>";
    str += "            <img src='static/img/chatbot.png'>";
    str += "          </span>";
    str += "          <div class='cm-msg-text'>";
    str += eval(button_lan);
    str += "  </div>";

    str += "  <div class='cm-msg-button'>";
    str += "    <ul>";
    str += "      <li>";
    str +=
      "          <button class='btn btn-sm btn-outline-primary fees'>Filters</button>";
    str += "      </li>";
    str += "      <li>";
    str +=
      "          <button class='btn btn-sm btn-outline-primary timings'>Drill-downs</button>";
    str += "      </li>";
    str += "      <li>";
    str +=
      "          <button class='btn btn-sm btn-outline-primary Visualizations'>Visualizations</button>";
    str += "      </li>";
    str += "    </ul>";
    str += "  </div>";
    str += "        </div>";
    $(".chat-logs").append(str);
    $("#Functions-details-form-" + INDEX.toString())
      .hide()
      .fadeIn(1000);
    $(".chat-logs")
      .stop()
      .animate({ scrollTop: $(".chat-logs")[0].scrollHeight }, 1000);
    speak(eval(button_lan));
    INDEX++;

  }

  /* Dummy - FF form generate */
  function course_registration_form_generate() {
    var button_lan = "button_option_msg_" + getCookie("language").replace("-", "_");
    var str = "";
    str += "<div id='Functions-registration-form-" + INDEX + "' class='chat-msg bot'>";
    str += "          <span class='msg-avatar'>";
    str += "            <img src='static/img/chatbot.png'>";
    str += "          </span>";
    str += "          <div class='cm-msg-text'>";
    str += eval(button_lan);
    str += "  </div>";

    str += "  <div class='cm-msg-button'>";
    str += "    <ul>";
    str += "      <li>";
    str +=
      "          <button class='btn btn-sm btn-outline-primary dummy_ff_1'>dummy_ff_1</button>";
    str += "      </li>";
    str += "      <li>";
    str +=
      "          <button class='btn btn-sm btn-outline-primary dummy_ff_2'>dummy_ff_2</button>";
    str += "      </li>";
    str += "      <li>";
    str += "         <div class='btn-group dropright'>";
    str +=
      "          <button class='btn btn-sm btn-outline-primary dropdown-toggle more' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>More</button>";
    str += "         <div class='dropdown-menu'>";
    str+="                 <button class='dropdown-item Others' type='button'>Others</button>";
    str+="           </div>";
    str+="           </div>";
    str += "      </li>";
    str += "    </ul>";
    str += "  </div>";
    str += "        </div>";
    $(".chat-logs").append(str);
    $("#Functions-registration-form-" + INDEX.toString())
      .hide()
      .fadeIn(1000);
    $(".chat-logs")
      .stop()
      .animate({ scrollTop: $(".chat-logs")[0].scrollHeight }, 1000);
    speak(eval(button_lan));
    INDEX++;

  }




  // Dummy - FF button form submit
  $(document).on("click", ".dummy_ff_1, .dummy_ff_2, .Others", function (e) {
    var class_name = $(e.target).attr('class');
    if (class_name.toLowerCase().indexOf("dummy_ff_1") >= 0) {
      var url_link = 'https://www.example.com/dummy/ff/1';
    }
    else if (class_name.toLowerCase().indexOf("dummy_ff_2") >= 0){
      var url_link = 'https://www.example.com/dummy/ff/2';
    }
    
    else{
      var url_link = 'https://www.example.com/dummy/ff/else/1';
    }
    var json_data = {
      "msg": "You can enroll yourself from below link",// ###############################################
      "url_link": url_link
    };
    var assist_msg = "assist_msg_" + getCookie("language").replace("-", "_");
    e.preventDefault();
    bot_typing();
    $.ajax({
      type: "POST",
      contentType: "application/json",
      url: "/api/languageTranslateWithThumbnail",
      dataType: "json",
      data: JSON.stringify(json_data),
      success: function (response) {
        if (response.status == 200) {
          $(".bot-typing").hide().fadeOut(1000);
          var html_parse = thumbnail_generate(response.result);
          bot_message(response.speak_msg);
          speak(response.speak_msg);
          bot_links(html_parse);
          $.each(response.fulfillmentMessages, function (index, value) {
            $.each(value.text.text, function (index, value_index) {
              if (value_index == 'Do you want further assistance?') {
                button = 'assistance';
              } else { button = '' }
              bot_message(value_index);
              speak(value_index);
            });
          });
          assistanceButton();


        } else {
          $(".bot-typing").hide().fadeOut(1000);
          $.each(response.fulfillmentMessages, function (index, value) {
            $.each(value.text.text, function (index, value_index) {
              bot_message(value_index);
              speak(value_index);
            });
          });
          assistanceButton();
        }
      },
      error: function (xhr, errmsg, err) {
        console.log(errmsg);
        console.log(err);
      },
    });
  });

       // technical button submit response
  $(document).on("click", ".Request Assistance", function (e) {
    var class_name = $(e.target).attr('class');
    if (class_name.toLowerCase().indexOf("Request Assistance") >= 0) {
      var technical_concept = "anaconda_installation"
    }
    
    var json_data = {
      "msg": "You can refer this link :-",
      "technical_concept": technical_concept
    };
    e.preventDefault();
    bot_typing();
    $.ajax({
      type: "POST",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(json_data),
      url: "/api/technicalButtonPrediction",
      success: function (response) {
        if (response.status == 200) {
          $(".bot-typing").hide().fadeOut(1000);       
          var html_parse = thumbnail_generate(response.result);
          bot_message(response.speak_msg);
          speak(response.speak_msg);
          bot_links(html_parse);
          $.each(response.fulfillmentMessages, function (index, value) {
            $.each(value.text.text, function (index, value_index) {
              bot_message(value_index);
              speak(value_index);
            });
          });
          // assistanceButton();
          satisfiedTechnical();
        } else {
          $(".bot-typing").hide().fadeOut(1000);
          $.each(response.fulfillmentMessages, function (index, value) {
            $.each(value.text.text, function (index, value_index) {
              bot_message(value_index);
              speak(value_index);
            });
          });
          assistanceButton();
        }
      },
      error: function (xhr, errmsg, err) {
        console.log(errmsg);
        console.log(err);
      },
    });
  });

 
  /* class form generate */
  function class_form_generate() {
    var button_lan = "button_option_msg_" + getCookie("language").replace("-", "_");
    var str = "";
    str += "<div id='class-form-" + INDEX + "' class='chat-msg bot'>";
    str += "          <span class='msg-avatar'>";
    str += "            <img src='static/img/chatbot.png'>";
    str += "          </span>";
    str += "          <div class='cm-msg-text'>";
    str += eval(button_lan);
    str += "  </div>";

    str += "  <div class='cm-msg-button'>";
    str += "    <ul>";
    str += "      <li>";
    str +=
      "          <button class='btn btn-sm btn-outline-primary dashboard-query'>Dashboard query</button>";
    str += "      </li>";
    str += "      <li>";
    str +=

      "          <button class='btn btn-sm btn-outline-primary Dummy'>Dummy - FF ST</button>";
    str += "      </li>";
    str += "    </ul>";
    str += "  </div>";
    str += "        </div>";
    $(".chat-logs").append(str);
    $("#class-form-" + INDEX.toString())
      .hide()
      .fadeIn(1000);
    $(".chat-logs")
      .stop()
      .animate({ scrollTop: $(".chat-logs")[0].scrollHeight }, 1000);
    speak(eval(button_lan));
    INDEX++;

    /* dashboard-query form generate */
    $(".dashboard-query").on("click", function (e) {
      e.preventDefault();
      dashboard_query_form_generate();
    });

  }

  
  


  /* Saving User Data */ //#############################################################################################
  $(".user-form").on("submit", function (e) {
    e.preventDefault();
    var data = $(this).serializeArray();
    var userDetails = {};
    $(data).each(function (i, field) {
      userDetails[field.name] = field.value;
    });
    $.ajax({
      type: "POST",
      url: "/api/userdetails",
      data: $(this).serialize(),
      success: function (response) {
        if (response.status == 200) {
          setCookie("name", userDetails.name, "1");
          setCookie("email", userDetails.email, "1");
          setCookie("mobile", userDetails.mobile, "1");
          setCookie("language", userDetails.language, "1");
          $(".chat-box-body").show();
          $(".chat-input").show();
          $(".chat-input button").show();
          $("#volume-up").show();
          $(".chat-box-refresh").show();
          $(".chat-box-form").hide();
          if (startup_counter == 1) {
            getMenu("startup");
            startup_counter++;
          }
        } else {
          var lan_name = "error_message_" + getCookie("language").replace("-", "_")
          speak(eval(lan_name));
        }
      },
      error: function (xhr, errmsg, err) {
        console.log(errmsg);
        console.log(err);
      },
    });
    $("#user-form")[0].reset();
  });


  $("#chat-submit").on("keyup",function(e) { 
      e.preventDefault();
          e.stopPropagation();
        if (e.keyCode === 13) { 
          $('.query').trigger('submit');
        } 
    });


  $("#chat-submit").on("click", function(e){
    e.preventDefault();
    e.stopPropagation();
    $('.query').trigger('submit');
  });
  /* Chatbot Chats */
  $(document).on("submit", ".query, .others_technical-query-generate-form", function (e) {
    e.preventDefault();
    e.stopPropagation();
    var class_name = $(e.target).attr('class');
    if (class_name.toLowerCase().indexOf("others_technical-query-generate-form") >= 0) {
      var values = {};
      $.each($('.others_technical-query-generate-form').serializeArray(), function(i, field) {
    values[field.name] = field.value;
      });
      var msg = values.query;
    }else{
      var msg = document.forms["query-form"].query.value;
    }
      user_message(msg);
      bot_typing();
      $.ajax({
        type: "POST",
        url: "/api/prediction",
        data: $(this).serialize(),
        success: function (response) {
          if (response.status == 200) {
            var intent = response.intent;
            var intent_type = response.intent_type;
            $('.user_query_hidden').attr('value', msg);
            if (intent == "class_link" || intent == "class_query"){
              $(".bot-typing").hide().fadeOut(1000);
              var batches = response.list_of_courses
              class_link_form_generate("class_link", batches);
            
            }
            else if (intent == "file_not_found") {
              $(".bot-typing").hide().fadeOut(1000);
              var batches = response.list_of_courses
              file_not_found_form_generate("file_not_found", batches);
            } 
            else if (intent == "Dashboard_access") {
              $(".bot-typing").hide().fadeOut(1000);
              var batches = response.list_of_courses;
              dashboard_access_form_generate(batches);
            } 
            else if (intent == "internship_query") {
              $(".bot-typing").hide().fadeOut(1000);
              var batches = response.list_of_courses
              course_detail_form_generate("internship_query", batches);
            }
            else if (intent == "Not_identified"){
              $(".bot-typing").hide().fadeOut(1000);
              var html_parse = thumbnail_generate(response.result);
              $.each(response.fulfillmentMessages, function (index, value) {
                $.each(value.text.text, function (index, value_index) {
                  bot_message(value_index);
                  speak(value_index);
                });
              });
              bot_links(html_parse);
              var assist_msg = "assist_msg_" + getCookie("language").replace("-", "_");
              var satisfy_msg = "satisfy_msg_" + getCookie("language").replace("-", "_");
              
              if (intent_type == "Technical") {
                bot_message(response.scrape_msg);
                speak(response.scrape_msg);
                ticketGenerateButton();
              }
              else {
                bot_message(response.scrape_msg);
                speak(response.scrape_msg);
              //   bot_message(eval(assist_msg));
              // speak(eval(assist_msg));
                // assistanceButton();
                ticketGenerateButton();
              }
            }
            else if (intent == "list_thumbnail") {
              $(".bot-typing").hide().fadeOut(1000);
              var button = '';
              var html_parse = thumbnail_generate(response.result);
              bot_message(response.speak_msg);
              speak(response.speak_msg);
              bot_links(html_parse);
              $.each(response.fulfillmentMessages, function (index, value) {
                $.each(value.text.text, function (index, value_index) {
                  if (value_index == 'Do you want further assistance?'){
                    button = 'assistance';
                  }else{button = ''}
                  bot_message(value_index);
                  speak(value_index);
                });
              });
              if (intent_type == "Technical") {
                satisfyButton();
              }
              else if (button == 'assistance'){
                assistanceButton();
              }else{
                ticketGenerateButton();
              }
            }
            else{
              $(".bot-typing").hide().fadeOut(1000);
              var button = '';
              $.each(response.fulfillmentMessages, function (index, value) {
                $.each(value.text.text, function (index, value_index) {
                  if (value_index == 'Do you want further assistance?') {
                    button = 'assistance';
                  } else { button = '' }
                  bot_message(value_index);
                  speak(value_index);
                });
              });
              if (intent_type == "Technical") {
                satisfyButton();
              }
              else if (button == 'assistance') {
                assistanceButton();
              } else {
                ticketGenerateButton();
              }
            }
            
          } else {
            $(".bot-typing").hide().fadeOut(1000);
            $('.user_query_hidden').attr('value', msg);
            $.each(response.fulfillmentMessages, function (index, value) {
              $.each(value.text.text, function (index, value_index) {
                bot_message(value_index);
                speak(value_index);
              });
            });
            assistanceButton();
          }
        },
        error: function (xhr, errmsg, err) {
          console.log(errmsg);
          console.log(err);
        },
      });
    $(".query")[0].reset();
    $(".others_technical-query-generate-form")[0].reset();
    $(".others_technical-query-generate-form select").attr("disabled", "true");
    $(".others_technical-query-generate-form button").attr("disabled", "true");
  });


  function thumbnail_generate(data) {
    var str = "";
    str += "<div class='col-md-12' style='margin-bottom: 20px;'>";
    str +=
        "  <div id='CarouselTest-" +
        INDEX +
        "' class='carousel slide pointer-event' data-ride='carousel'>";
    str += "    <div class='carousel-inner'>";
    $.each(data, function (index, value) {
        if (index == 0) {
            str += "        <div class='carousel-item active'>";
        } else {
            str += "        <div class='carousel-item'>";
        }
        str += "          <div class='card'>";
        str += "            <div class='card-body'>";
        str += "              <h5 class='card-title'>" + value.title + "</h5>";
        str += "              <p class='card-text'>" + value.description + " </p>";
        str +=
            "              <a href='" +
            value.url +
            "' class='btn btn-primary' target='_blank'>Visit page</a>";
        str += "             </div>";
        str += "           </div>";
        str += "         </div>";
    });
    str += "      </div>";
    str += "  </div>";
    str += "</div>";
    INDEX++;
    return str;
  }

  /* Get assistance(Yes/No) button */
  function assistanceButton() {
    var str = "";

    str += "<div id='cm-msg-assistance-" + INDEX + "' class='chat-msg bot'>";
    str += "  <div class='cm-msg-button assist-button'>";
    str += "    <ul>";
    str += "      <li>";
    str +=
      "          <button  class='btn btn-sm btn-outline-primary assist-yes'>Yes</button>";
    str += "      </li>";
    str += "      <li>";
    str +=
      "          <button class='btn btn-sm btn-outline-primary assist-no'>No</button>";
    str += "      </li>";
    str += "    </ul>";
    str += "  </div>";
    str += "</div>";
    $(".chat-logs").append(str);
    $("#cm-msg-assistance-" + INDEX.toString())
      .hide()
      .fadeIn(1000);
    $(".chat-logs")
      .stop()
      .animate({ scrollTop: $(".chat-logs")[0].scrollHeight }, 1000);
    INDEX++;
  }

  // Yes assistance click menu display
  $(document).on("click", ".assist-yes", function (e) {
    getMenu("conversation");
    $(".assist-button button").attr("disabled", "true");
  });

  // No assistance click menu display
  $(document).on("click", ".assist-no", function (e) {
    var lan_name = "good_bye_message_" + getCookie("language").replace("-", "_")
    bot_message(eval(lan_name));
    speak(eval(lan_name));
    $(".assist-button button").attr("disabled", "true");
  });


  /* Get satisfied (Yes/No) button */
  function satisfyButton() {
    var str = "";

    str += "<div id='cm-msg-satisfied-" + INDEX + "' class='chat-msg bot'>";
    str += "  <div class='cm-msg-button satisfy-button'>";
    str += "    <ul>";
    str += "      <li>";
    str +=
      "          <button  class='btn btn-sm btn-outline-primary satisfy-yes'>Yes</button>";
    str += "      </li>";
    str += "      <li>";
    str +=
      "          <button class='btn btn-sm btn-outline-primary satisfy-no'>No</button>";
    str += "      </li>";
    str += "    </ul>";
    str += "  </div>";
    str += "</div>";
    $(".chat-logs").append(str);
    $("#cm-msg-satisfied-" + INDEX.toString())
      .hide()
      .fadeIn(1000);
    $(".chat-logs")
      .stop()
      .animate({ scrollTop: $(".chat-logs")[0].scrollHeight }, 1000);
    INDEX++;
  }

   /* ticketGenerateButton (Yes/No)  */
  function ticketGenerateButton() {
    var str = "";

    str += "<div id='cm-msg-tktGenerate-" + INDEX + "' class='chat-msg bot'>";
    str += "  <div class='cm-msg-button tktGenerate-button'>";
    str += "    <ul>";
    str += "      <li>";
    str +=
      "          <button  class='btn btn-sm btn-outline-primary tktGenerate-yes'>Generate ticket</button>";
    str += "      </li>";
    str += "      <li>";
    str +=
      "          <button class='btn btn-sm btn-outline-primary tktGenerate-no'>I am satisfy with the query</button>";
    str += "      </li>";
    str += "    </ul>";
    str += "  </div>";
    str += "</div>";
    $(".chat-logs").append(str);
    $("#cm-msg-tktGenerate-" + INDEX.toString())
      .hide()
      .fadeIn(1000);
    $(".chat-logs")
      .stop()
      .animate({ scrollTop: $(".chat-logs")[0].scrollHeight }, 1000);
    INDEX++;
  }

   /* Get satisfied from technical button (Yes/No)*/
  function satisfiedTechnical() {
    var str = "";

    str += "<div id='cm-msg-satisfied-technical-" + INDEX + "' class='chat-msg bot'>";
    str += "  <div class='cm-msg-button satisfied-technical-button'>";
    str += "    <ul>";
    str += "      <li>";
    str +=
      "          <button  class='btn btn-sm btn-outline-primary satisfied-technical-yes'>Yes</button>";
    str += "      </li>";
    str += "      <li>";
    str +=
      "          <button class='btn btn-sm btn-outline-primary satisfied-technical-no'>No</button>";
    str += "      </li>";
    str += "    </ul>";
    str += "  </div>";
    str += "</div>";
    $(".chat-logs").append(str);
    $("#cm-msg-satisfied-technical-" + INDEX.toString())
      .hide()
      .fadeIn(1000);
    $(".chat-logs")
      .stop()
      .animate({ scrollTop: $(".chat-logs")[0].scrollHeight }, 1000);
    INDEX++;
  }

  // Yes satisfy click assistance display
  $(document).on("click", ".satisfy-yes, .tktGenerate-no, .satisfied-technical-yes", function (e) {
    var assist_msg = "assist_msg_" + getCookie("language").replace("-", "_");
    bot_message(eval(assist_msg));
    speak(eval(assist_msg));
    assistanceButton();
    $(".satisfy-button button").attr("disabled", "true");
    $(".tktGenerate-button button").attr("disabled", "true");
  });

  /* Technical button satisfy no then ask for query */
  $(document).on("click", '.satisfied-technical-no', function(e){
  others_technical_form_generate();
  })
  // No satisfy click scrape & displa URL
  $(document).on("click", ".satisfy-no", function (e) {
    var user_msg = $('.user_query_hidden').val();
    console.log(user_msg);
    bot_typing();
    var json_data = {
      "user_query": user_msg
    }
    $.ajax({
      type: "POST",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(json_data),
      url: "/api/satisfyNoScrapeData",
      success: function (response) {
        if (response.status == 200) {
          $(".bot-typing").hide().fadeOut(1000);
          var html_parse = thumbnail_generate(response.result);
          $.each(response.fulfillmentMessages, function (index, value) {
            $.each(value.text.text, function (index, value_index) {
              bot_message(value_index);
              speak(value_index);
            });
          });
          bot_links(html_parse);
          bot_message(response.scrape_msg_after);
          speak(response.scrape_msg_after);
          ticketGenerateButton();
        } else {
          $(".bot-typing").hide().fadeOut(1000);
          $.each(response.fulfillmentMessages, function (index, value) {
            $.each(value.text.text, function (index, value_index) {
              bot_message(value_index);
              speak(value_index);
            });
          });
          assistanceButton();
        }
      },
      error: function (xhr, errmsg, err) {
        console.log(errmsg);
        console.log(err);
      },
    });

    $(".satisfy-button button").attr("disabled", "true");
  });

   // tktGenerate-yes send email to support
  $(document).on("click", ".tktGenerate-yes", function (e) {
    var user_msg = $('.user_query_hidden').val();
    console.log(user_msg);
    bot_typing();
    var json_data = {
      "user_query": user_msg
    }
    $.ajax({
      type: "POST",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(json_data),
      url: "/api/notSatisfiedSendEmail",
      success: function (response) {
        if (response.status == 200) {
          $(".bot-typing").hide().fadeOut(1000);
          var html_parse = thumbnail_generate(response.result);
          $.each(response.fulfillmentMessages, function (index, value) {
            $.each(value.text.text, function (index, value_index) {
              bot_message(value_index);
              speak(value_index);
            });
          });
          assistanceButton();
        } else {
          $(".bot-typing").hide().fadeOut(1000);
          $.each(response.fulfillmentMessages, function (index, value) {
            $.each(value.text.text, function (index, value_index) {
              bot_message(value_index);
              speak(value_index);
            });
          });
          assistanceButton();
        }
      },
      error: function (xhr, errmsg, err) {
        console.log(errmsg);
        console.log(err);
      },
    });

    $(".tktGenerate-button button").attr("disabled", "true");
  });

  /* Speech recognition and synthesis */

  // Test browser support
  window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition || null;

  if (window.SpeechRecognition === null) {
    console.log("speech recognition not supported in your browser");
    $("#chat-submit-mic").attr("data-toggle", "tooltip");
    $("#chat-submit-mic").attr(
      "title",
      "Speech recognition not supported in your browser"
    );
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
    $("#chat-submit-mic").prop("disabled", true);
  } else {
    $("#chat-submit-mic").attr("data-toggle", "tooltip");
    $("#chat-submit-mic").attr("title", "Press and hold to speak");
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });


    var recognizer = new window.SpeechRecognition();
    var transcription = document.getElementById("chat-input");

    // Recognizer doesn't stop listening even if the user pauses
    recognizer.continuous = true;

    // Start recognizing
    recognizer.onresult = function (event) {
    transcription.val = "";

      for (var i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcription.val = event.results[i][0].transcript;
          console.log("Confidence: " + event.results[i][0].confidence);
          $("#chat-input").val(transcription.val);
        } else {
          transcription.val += event.results[i][0].transcript;
        }
      }

      $(document).ready(function ($) {
        if ($("#chat-input").val().length > 1) {
          $("#chat-submit").trigger("click");
          transcription.val = "";
        }
      });
      
    };

    // Listen for errors
    recognizer.onerror = function (event) {
      console.log("Recognition error: " + event.message);
    };

    $("#chat-submit-mic").bind("mousedown touchstart", function (e) {
      e.preventDefault();
      try {
        recognizer.start();
        $(".chat-submit-mic").css({ color: "red" });
        console.log("Recognition started");
      } catch (ex) {
        console.log("Recognition error: " + ex.message);
      }
    });

    $("#chat-submit-mic").bind("mouseup touchend", function (e) {
      e.preventDefault();
      try {
        recognizer.stop();
        $(".chat-submit-mic").css({ color: "#f5a55a" });
        console.log("Recognition stopped");
      } catch (ex) {
        console.log("Recognition error: " + ex.message);
      }
    });
  }

  /*
   * Check for browser support
   */

  /* Set Volume */
  var volumeInput = 1;
  $("#volume-down").hide();
  $("#volume-up").click(function () {
        volumeInput = 0;
        $("#volume-down").show();
        $("#volume-up").hide();
        window.speechSynthesis.cancel();
  });

  $("#volume-down").click(function () {
        volumeInput = 1;
        $("#volume-up").show();
        $("#volume-down").hide();
  });

  if ("speechSynthesis" in window) {
    console.log("Your browser supports speech synthesis.");
    var synthesis = window.speechSynthesis;
    // var utterance = new SpeechSynthesisUtterance("Hello World");
    // Regex to match all English language tags e.g en, en-US, en-GB
    // var langRegex = /^en(-[a-z]{2})?$/i;

    // Get the available voices and filter the list to only have English speakers
    var voices = speechSynthesis
      .getVoices();
      // .filter((voice) => langRegex.test(voice.lang));

    // Log the properties of the voices in the list
    voices.forEach(function (voice) {
      console.log({
        name: voice.name,
        lang: voice.lang,
        uri: voice.voiceURI,
        local: voice.localService,
        default: voice.default,
      });
    });
  } else {
    console.log(
      "Sorry your browser does not support speech synthesis."
    );
  }

  // Create a new utterance for the specified text and add it to
  // the queue.
  function speak(text) {
    // Create a new instance of SpeechSynthesisUtterance.
    var msg = new SpeechSynthesisUtterance();

    // Set the text.
    msg.text = text;

    // Get the attribute controls.
    var rateInput = 1;
    var pitchInput = 1;

    // Set the attributes.
    msg.lang = getCookie("language");
    msg.volume = parseFloat(volumeInput);
    msg.rate = parseFloat(rateInput);
    msg.pitch = parseFloat(pitchInput);

    msg.voice = voices[3];
 
    window.speechSynthesis.speak(msg);
  }
  
});
