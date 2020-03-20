// Start the game
function StartIframe() {
  rules = ["Rule1", "Rule2", "Rule3", "Rule4", "Rule5", "Rule6", "Rule7", "Rule8", "Rule9", "Rule10"];

    //rules = [Rule1, Rule2, Rule3, Rule4, Rule5, Rule6, Rule7, Rule8, Rule9, Rule10];
    rule_names = ['Zeta' ,'Phi' ,'Upsilon' ,'Iota' ,'Kappa' ,'Omega' ,'Mu' ,'Nu' ,'Xi', 'Psi'];
    // rule_names = ['Geosyog' ,'Plasill' ,'Bioyino' ,'Waratel' ,'Sepatoo' ,'Moderock' ,'Replitz' ,'Pegmode' ,'Mizule ', 'Lazap'];


    $.ajax({
        dataType: "json",
        url: "/json/zendo_cases.json",
        async: false,
        success: function(data) {

            console.log("Got trial data");
            zendo_cases = data;
            StartIframe2();
        }
    });
};


function StartIframe2()
{

    rand_trial = Math.floor(Math.random()*9);
    rand_counter = Math.floor(Math.random()*11);

    prompt_phase1 = '<p id="prompt2" align="left">&#8226 Here are some objects.<br>' +
                '&#8226 Click "<b>Test</b>" to see if they emit <b>'  +
                    rule_names[rand_trial] + '</b> waves.</p>';

    prompt_phase2 = '<p id="prompt2" align="left">&#8226 Now choose your own arrangement.  Click on the squares at the bottom to add objects to the scene.<br>' +
        '&#8226 Once added, <b>left hold click</b> on objects to move them, use "<b>Z</b>"/"<b>X</b>" to rotate, and <b>right click</b> to remove.<br>' +
        '&#8226 When you have the arrangement you want, click "<b>Test</b>" to see if it emits <b>'  +
            rule_names[rand_trial] + '</b> waves.<br>' +
        '&#8226 Outcomes of your previous tests are shown at the top.  You get <b>8</b> tests in total.<br>' +
        '&#8226 A yellow star means your arrangement did follow the rule,  an empty star means it did not.</p>';

    prompt_phase3 = '<p id="prompt2" align="left">&#8226 Here are 8 new arrangements<br>' +
    '&#8226 Select which ones you think emit <b>'  +
            rule_names[rand_trial] + '</b> waves<br>' +
    '&#8226 You must select at least 1 and less than all 8.<b>';

    //Prep data
    examples = zendo_cases[rand_trial].t.slice(0,1);
    test_cases = zendo_cases[rand_trial].t.slice(1).concat(zendo_cases[rand_trial].f.slice(1));

//     var iframe = document.getElementById("game_frame");
//
//     if (iframe) {
//         var iframeContent = (iframe.contentWindow || iframe.contentDocument);
//         console.log('Starting iframe');
//         iframeContent.Start(rules[rand_trial], examples, test_cases, rule_names[rand_trial], rand_counter);
//     }
}

function description_phase()
{
    document.getElementById('game_frame').src = document.getElementById('game_frame').src;
    StartIframe();
}
