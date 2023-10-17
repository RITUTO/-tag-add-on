import { EntitySkinIdComponent, ScriptEventCommandMessageAfterEvent, system, world } from "@minecraft/server";//インポート
import { ModalFormData,ActionFormData,MessageFormData} from "@minecraft/server-ui";

                


world.afterEvents.playerBreakBlock.subscribe(ev =>{
      const { player,brokenBlockPermutation } = ev;
        player.runCommandAsync(`scoreboard objectives add "mine:${brokenBlockPermutation.type.id}" dummy `)
        player.runCommandAsync(`scoreboard objectives add "blockminecount" dummy `)
        player.runCommandAsync(`scoreboard players add @s mine:${brokenBlockPermutation.type.id} 1`)
        player.runCommandAsync(`scoreboard players add @s blockminecount 1`)//ブロックほった数をカウント
            
  })
  system.runInterval( function(){
    for(const taisyou of world.getDimension("overworld").getEntities({type:"minecraft:player"})){
        const health = Math.round(taisyou.getComponent("health").currentValue);
        taisyou.runCommandAsync(`scoreboard objectives add hp dummy `)
        taisyou.runCommandAsync(`scoreboard players set @s hp ${health}`)//hpカウント
        if (taisyou.isOp()){
         taisyou.addTag("op")
        }else{
          taisyou.removeTag("op")
        }
  }} , 0)
  
  world.afterEvents.entityHitEntity.subscribe(ev =>{//ヒット数カウント
    const entiy = ev.damagingEntity
    entiy.runCommandAsync("scoreboard objectives add hitcount dummy")
    entiy.runCommandAsync("scoreboard players add @s hitcount 1")
}
    )
    world.beforeEvents.chatSend.subscribe(ev => { //チャットが送信されたら
      const message = ev.message;
      const sender = ev.sender;
      
      var ke = (sender.getTags().filter(t => t.startsWith("mute")))//mute tagがついてるか確認
      if (ke[0] !== undefined){
      let sp = ke[0]
      let kekkafisp = sp.split(':')
      ev.cancel = true; //チャットをキャンセル
      sender.sendMessage(`${kekkafisp[1]}`)
    }else{
      var ke = (sender.getTags().filter(t => t.startsWith("blockword")))//muteword tagがついてるか確認
      if (ke[0] !== undefined){
      let sp = ke[0]
      let kekkafisp = sp.split(':')
      if (message == kekkafisp[1]){
        ev.cancel = true
      }
    }else{
      sender.runCommandAsync("scoreboard objectives add chatcount dummy")
      sender.runCommandAsync(`scoreboard players add @s chatcount 1`)//チャットカウント
      var ke = (sender.getTags().filter(t => t.startsWith("word")))//word tagがついてるか確認
      if (ke[0] !== undefined){
      sender.runCommandAsync(`tag @s remove "${ke[0]}"`)
      }
      system.runTimeout( function(){
      sender.addTag(`chat:${message}`)})
    }}})