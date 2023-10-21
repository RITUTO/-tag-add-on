import { EntitySkinIdComponent, ScriptEventCommandMessageAfterEvent, system, world } from "@minecraft/server";//インポート
import { ModalFormData,ActionFormData,MessageFormData} from "@minecraft/server-ui";
world.afterEvents.itemUseOn.subscribe(async ev => {
  const { source: player,itemStack:item} = ev;
  

  var ke = (player.getTags().filter(t => t.startsWith("blockput")))//blockput tagがついてるか確認
  if (ke[0] !== undefined){
  player.removetags(`tag @s remove "${ke[0]}"`)
  }
  player.runCommandAsync(`tag @s add "blockput:${item.typeId}"`);
})          


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
        if (taisyou.isSneaking){
          taisyou.runCommandAsync("scoreboard objectives add sneak dummy")
          taisyou.runCommandAsync(`scoreboard players add @s sneak 1`)//スニークタイムカウント
        }else{
          taisyou.runCommandAsync(`scoreboard players reset @s sneak`)
        }
        taisyou.getTags().forEach((tag) => {
          if (tag.startsWith("hastag:")) {
           let b = tag.replace("hastag:", "");
           taisyou.runCommandAsync(`tag @s remove ${tag}`)
            if (taisyou.hasTag(b))
           {
            taisyou.runCommandAsync(`tag @s add true`)

          }else{
            taisyou.runCommandAsync(`tag @s add false`)
          }
        }})
  }} , 0)
  
  world.afterEvents.entityHitEntity.subscribe(ev =>{//ヒット数カウント
    const entiy = ev.damagingEntity
    const hitentiy = ev.hitEntity
    entiy.runCommandAsync("scoreboard objectives add hitcount dummy")
    entiy.runCommandAsync("scoreboard players add @s hitcount 1")
    entiy.addTag("attack")//受けたmobと攻撃したmobにtag追加
    hitentiy.runCommandAsync("tag @s add hit")
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
      var ke = (sender.getTags().filter(t => t.startsWith("chat")))//word tagがついてるか確認
      if (ke[0] !== undefined){
      sender.runCommandAsync(`tag @s remove "${ke[0]}"`)
      }
      system.runTimeout( function(){
      sender.addTag(`chat:${message}`)})
    }}})
