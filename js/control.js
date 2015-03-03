var self = this;


function qrCreate(){

	var ipAddress = $('#socketServerIP').val();
	var portNumber = $('#socketServerPort').val();

	var jsonText = 	'{"ip":"' +
									ipAddress +
									'","port":' +
									portNumber +
									'}'
	console.log(jsonText)
	$('#qrcodeCanvas').empty();


	$('#qrcodeCanvas').qrcode({
		text	: jsonText
	});
}

function connect(){
	// 入力されたpepperのIPアドレスを取得
	var pepperIp = $("#pepperIP").val();

	// 接続が成功したら、各種プロキシを作成して代入しておく
    var setupIns_ = function(){
    	self.qims.service("ALTextToSpeech").done(function(ins){
    		self.alTextToSpeech = ins;
        });
        self.qims.service("ALAnimatedSpeech").done(function(ins){
    		self.alAnimatedSpeech = ins;
        });
        self.qims.service("ALMotion").done(function(ins){
        	self.alMotion = ins;
        });
        self.qims.service("ALBehaviorManager").done(function(ins){
        	self.alBehavior = ins;
        });
    	self.qims.service("ALAutonomousLife").done(function(ins){
    		self.alAutonomousLife = ins;
        });
        self.qims.service("ALAudioDevice").done(function(ins){
            self.alAudioDevice = ins;
            self.alAudioDevice.getOutputVolume().done(function(val){
		    self.showAudioVolume(val);
		    });
        });
        self.qims.service("ALMemory").done(function(ins){
    		self.alMemory = ins;

    		// メモリ監視
    		qimessagingMemorySubscribe();
        });
    }

	// pepperへの接続を開始する
	self.qims = new QiSession(pepperIp);
	self.qims.socket()
		// 接続成功したら
		.on('connect', function ()
			{
   	 		self.qims.service("ALTextToSpeech")
   	 			.done(function (tts)
   	 			{
   	 	        	tts.say("接続、成功しました");
   	 	       });
   	 	       		// 接続成功したら各種セットアップを行う
     	       		setupIns_();

     	       		// 接続成功表示切り替え
     	       		$(".connectedState > .connected > .connectedText").text("接続成功");
     	       		$(".connectedState > .connected > .glyphicon").removeClass("glyphicon-remove");
     	       		$(".connectedState > .connected > .glyphicon").addClass("glyphicon-signal");
     	       		$(".connectedState > .connected").css("color","Blue");


     	       })
     	// 接続失敗したら
        .on('disconnect', function () {
              //self.nowState("切断");
});
}


function showAudioVolume(val){
	console.log(val);
	// あとからページに表示させる
	$("#pepperVolume").val(val);
}

function changeAudioVolume(){
	var volume = $("#pepperVolume").val();
	volume = Number(volume);
	console.log(Number(volume));
	self.alAudioDevice.setOutputVolume(volume);
	self.hello();

}


// 動作確認用Hello
function hello(){
	console.log("hello");
	this.alAnimatedSpeech.say("はろー");

}

// おしゃべり
function say(){
	console.log("say");
	var value = $("#sayText").val();
	this.alTextToSpeech.say(value);
}

// 動きながらおしゃべり
function animatedSay(){
	console.log("say");
	var value = $("#animatedSayText").val();
	this.alAnimatedSpeech.say(value);
}


// 移動
function move(to){
	if (self.alMotion){
		console.log("move to");
		switch (to){
			case 0:
				self.alMotion.moveTo(0, 0, 0.5).fail(function(err){console.log(err);});
				break;

			case 1:
				self.alMotion.moveTo(0, 0, -0.5).fail(function(err){console.log(err);});
				break;

			case 2:
				self.alMotion.moveTo(0.3, 0, 0).fail(function(err){console.log(err);});
				break;

			case 3:
				self.alMotion.moveTo(-0.3, 0, 0).fail(function(err){console.log(err);});
				break;
			case 4:
				self.alMotion.moveTo(0, 0, 0).fail(function(err){console.log(err);});
				break;

		}
	}
}

// ビヘイビアアクション
function action(num){
	switch (num){
		case 0:
			self.alBehavior.stopAllBehaviors();
			break;
		case 1:
			self.alBehavior.runBehavior("animation-5ffd19/HighTouch");
			break;
		case 2:
			self.alBehavior.runBehavior("pepper_self_introduction_waist_sample/.");
			break;
		case 3:
			self.alBehavior.runBehavior("pepper_tongue_twister_sample/.");
			break;
		case 4:
			self.alBehavior.runBehavior("animations/Stand/Emotions/Positive/Laugh_1");
			break;
		case 5:
			self.alBehavior.runBehavior("animations/Stand/Emotions/Negative/Sad_1");
			break;
		case 6:
			self.alBehavior.runBehavior("animations/Stand/Gestures/ComeOn_1");
			break;
		case 7:
			self.alBehavior.runBehavior("pepper_anim_sample/d-110-owata");
			break;
		case 8:
			self.alBehavior.runBehavior("pepper_anim_sample/d-110-glad-3");
			break;
		case 9:
			self.alBehavior.runBehavior("animations/Stand/Gestures/Angry_1");
			break;

	}
}

function autonomousSwitch(bl){
	var status;
	if (bl)
	{
		console.log("ON");
		self.alAutonomousLife.getState().done(function(val){console.log(val)});
		self.alAutonomousLife.setState("solitary");

	}else
	{
		console.log("OFF");
		self.alAutonomousLife.getState().done(function(val){console.log(val)});
		self.alAutonomousLife.setState("disabled");
	}
}

function sleepSwitch(bl){
	var status;
	if (bl)
	{
		console.log("ON");
		self.alMotion.wakeUp();

	}else
	{
		console.log("OFF");
		self.alMotion.rest();
	}
}


function qimessagingMemoryEvent(){
	console.log("push!");
	self.alMemory.raiseEvent("PepperQiMessaging/Hey", "1");
}

function qimessagingMemorySubscribe(){
	console.log("subscriber!");
	self.alMemory.subscriber("PepperQiMessaging/Reco").done(function(subscriber)
		{
            subscriber.signal.connect(toTabletHandler);
        }
    );
}


function toTabletHandler(value) {
        console.log("PepperQiMessaging/Recoイベント発生: " + value);
        $(".memory").text(value);
}
