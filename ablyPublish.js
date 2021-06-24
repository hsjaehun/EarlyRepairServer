const realtime = new Ably.Realtime({ key: "0BaVrg.FPCCkg:Bi_JOu2bl5MuCDZ5" });
const myVotingChannel = realtime.channels.get("voting-channel");

function castVote(choice) {
  myVotingChannel.publish("vote", choice, (err) => {
    console.log(choice);
    console.log(err);
  });
}
