import { Application, Assets, Rectangle, Sprite, Graphics } from "pixi.js";
import { Viewport } from "pixi-viewport";

(async () => {
  const app = new Application();

  // 앱 초기화 (화면 크기 500x500)
  await app.init({ background: "#1099bb", width: 500, height: 500 });

  // Pixi 캔버스를 컨테이너에 추가
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  // 뷰포트 생성
  const vp = new Viewport({
    screenWidth: 500,
    screenHeight: 500,
    worldWidth: 3000,
    worldHeight: 3000,
    passiveWheel: false,
    events: app.renderer.events,
  });

  // 앱 스테이지에 뷰포트 추가
  app.stage.addChild(vp);

  // 월드 배경 생성 (격자 패턴)
  const worldBackground = new Graphics();
  worldBackground.beginFill(0xf0f0f0);
  worldBackground.drawRect(0, 0, 3000, 3000);
  worldBackground.endFill();

  // 격자 그리기
  worldBackground.lineStyle(1, 0xcccccc, 0.5);
  for (let x = 0; x < 3000; x += 100) {
    worldBackground.moveTo(x, 0);
    worldBackground.lineTo(x, 3000);
  }
  for (let y = 0; y < 3000; y += 100) {
    worldBackground.moveTo(0, y);
    worldBackground.lineTo(3000, y);
  }

  // 뷰포트에 배경 추가
  vp.addChild(worldBackground);

  // 캐릭터 생성 (초록색 사각형)
  const character = new Graphics();
  character.beginFill(0x00ff00);
  character.drawRect(-25, -25, 50, 50); // 중심점 기준 50x50 사각형
  character.endFill();

  // 캐릭터 초기 위치 (월드 중앙)
  character.position.set(1500, 1500);

  // 뷰포트에 캐릭터 추가
  vp.addChild(character);

  // 키보드 상태 추적
  const keys: { [key: string]: boolean } = {};

  // 이동 속도
  const MOVE_SPEED = 5;

  // 키보드 이벤트 리스너
  window.addEventListener("keydown", (e) => {
    // 기존 키 상태 초기화
    keys["arrowleft"] = false;
    keys["arrowright"] = false;
    keys["arrowup"] = false;
    keys["arrowdown"] = false;
    keys["a"] = false;
    keys["d"] = false;
    keys["w"] = false;
    keys["s"] = false;

    // 현재 누른 키만 true로 설정
    keys[e.key.toLowerCase()] = true;
  });

  window.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
  });

  // 애니메이션 루프
  app.ticker.add(() => {
    let dx = 0;
    let dy = 0;

    // 우선순위를 두어 한 방향으로만 이동
    if (keys["arrowleft"] || keys["a"]) {
      dx = -MOVE_SPEED;
    } else if (keys["arrowright"] || keys["d"]) {
      dx = MOVE_SPEED;
    } else if (keys["arrowup"] || keys["w"]) {
      dy = -MOVE_SPEED;
    } else if (keys["arrowdown"] || keys["s"]) {
      dy = MOVE_SPEED;
    }

    // 캐릭터 이동
    if (dx !== 0 || dy !== 0) {
      // 새 위치 계산
      const newX = character.x + dx;
      const newY = character.y + dy;

      // 월드 경계 체크
      const minX = 25; // 캐릭터 반경
      const minY = 25;
      const maxX = 3000 - 25;
      const maxY = 3000 - 25;

      // 경계 내에서만 이동 허용
      character.x = Math.max(minX, Math.min(newX, maxX));
      character.y = Math.max(minY, Math.min(newY, maxY));

      // 카메라를 캐릭터 중심으로 이동
      vp.moveCenter(character.x, character.y);
    }
  });

  // 초기 카메라 위치 설정
  vp.moveCenter(1500, 1500);
})();
