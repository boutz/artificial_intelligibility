var t = {
  title: "/t/",
  text:
    "<p>Tip of tongue presses against tooth ridge.</p><p>Sides of tongue press against upper side teeth.</p><p>The sound is made as the air is released.</p>",
  imgLocation: "images/t-sound.gif",
  audio: "audio/t.m4a",
  audioFiles: ["audio/table.m4a", "audio/attack.m4a", "audio/cat.m4a"],
  audioText: [
    "<strong>t</strong>able </br> / <strong>t</strong> eɪ b ə l /", // table
    "a<strong>tt</strong>ack </br> / ə <strong>t</strong> æ k / ", // attack
    "ca<strong>t</strong> </br> / k æ <strong>t</strong> /", // cat
  ],
};

var s = {
  title: "/s/",
  text:
    "<p>Front of tongue is close to tooth ridge.</p> <p>Tip of tongue is close to upper back of top front teeth.</p> <p>Tongue is hard as air is pushed out between the centre of tongue tip and the tooth ridge.</p>",
  imgLocation: "images/s-sound.gif",
  audio: "audio/s.m4a",
  audioFiles: ["audio/safe.m4a", "audio/asked.m4a", "audio/pass.m4a"],
  audioText: [
    "<strong>s</strong>afe </br> / <strong>s</strong> eɪ f /", // safe
    "a<strong>s</strong>ked </br> / æ <strong>s</strong> k t /", // asked
    "pa<strong>ss</strong> </br> / p æ <strong>s</strong> / ", // pass
  ],
};

var ʃ = {
  title: "/ʃ/",
  text:
    "<p>Air is forced between a gap in the centre of the front of the tongue and the back of the tooth ridge.</p> <p>Sides of tongue may touch the side teeth.</p> <p>The lips protude.</p>",
  imgLocation: "images/sh-sound.gif",
  audio: "audio/sh.m4a",
  audioFiles: ["audio/shine.m4a", "audio/fashion.m4a", "audio/mash.m4a"],
  audioText: [
    "<strong>sh</strong>ine </br> / <strong>ʃ</strong> aɪ n /", // shine
    "fa<strong>sh</strong>ion </br> / f æ <strong>ʃ</strong> ə n /", // fashion
    "ma<strong>sh</strong> </br> / m æ <strong>ʃ</strong> /", // mash
  ],
};

var ɪ = {
  title: "/ɪ/",
  text: "<p>Relaxed lips.</p> <p>Front of the tongue is central/high.</p> ",
  imgLocation: "images/i-sound.gif",
  audio: "audio/i.m4a",
  audioFiles: ["audio/italy.m4a", "audio/tin.m4a", "audio/wish.m4a"],
  audioText: [
    "<strong>I</strong>taly </br> / <strong> ɪ</strong> t ə l i: / ", // Italy
    "t<strong>i</strong>n </br> / t <strong> ɪ</strong> n / ", // tin
    "w<strong>i</strong>sh </br> / w <strong> ɪ</strong> ʃ / ", // wish
  ],
};

var i = {
  title: "/i:/",
  text:
    "<p>Tongue is high</p> <p>The jaw is almost closed.</p> <p>Sides of tongue touch the top side teeth.</p> ",
  imgLocation: "images/ee-sound.gif",
  audio: "audio/ee.m4a",
  audioFiles: ["audio/even.m4a", "audio/teeth.m4a", "audio/happy.m4a"],
  audioText: [
    "<strong>e</strong>ven </br> / <strong>i:</strong> v ə n / ", // even
    "t<strong>ee</strong>th </br> / t <strong>i:</strong> θ / ", // teeth
    "happ<strong>y</strong> </br> / h æ p <strong>i:</strong> /", // happy
  ],
};

var dict = {
  sit: ["s", "ɪ", "t"],
  seat: ["s", "i:", "t"],
  sheet: ["ʃ", "i:", "t"],
};

var modelPron = {
  sit: "audio/sit.m4a",
  seat: "audio/seat.m4a",
  sheet: "audio/sheet.m4a",
  she_speaks: "audio/she_speaks.wav",
  is_it_raining: "audio/is_it_raining.wav",
  where_do_you_live: "audio/where_do_you_live.wav",
  garden_1: "audio/garden_1.wav",
  attack_2: "audio/attack_2.wav",
  police_2: "audio/police_2.wav",
  happen_1: "audio/happen_1.wav",
};

var modelImages = {
  is_it_raining: "images/isitraining_pitch.png",
  where_do_you_live: "images/wheredoyoulive_pitch.png",
  she_speaks: "images/shespeaks_pitch.png",
  sit: "images/sit.png",
  seat: "images/seat.png",
  sheet: "images/sheet.png",
  garden_1: "images/garden_1.png",
  garden_2: "images/garden_2.png",
  attack_1: "images/attack_1.png",
  attack_2: "images/attack_2.png",
  police_1: "images/police_1.png",
  police_2: "images/police_2.png",
  happen_1: "images/happen_1.png",
  happen_2: "images/happen_2.png",
};
