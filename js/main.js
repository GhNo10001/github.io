import { Render } from './render.js';
import { Event } from './event.js';
import { State } from './state.js';
import { Config } from './config.js';

export const Main = {
    // 开始游戏
    startGame() {
        document.getElementById('startScreen').style.display = 'none';
        document.getElementById('game').style.display = 'flex';
        Render.init();
        Event.firstScreen();
        this.startGameLoop();
    },
    
    // 游戏结束
    ending(reason) {
        document.getElementById('endReason').textContent = reason;
        document.getElementById('endScreen').style.display = 'flex';
    },
    
    // 游戏主循环
    startGameLoop() {
        setInterval(() => {
            // 检查死亡
            if (State.hp <= 0 && document.getElementById('endScreen').style.display === 'none') {
                this.ending('你的修为尽失，道途断绝...');
            }
            
            // 检查飞升
            if (State.lv >= Config.realm.length - 1) {
                this.ending('恭喜飞升成功，成为仙界一员！');
            }
            
            // 更新冷却
            if (State.cd > 0) {
                State.cd--;
            }
        }, 1000);
    }
};
