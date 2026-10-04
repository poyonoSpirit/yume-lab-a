"use client";

// useEffect:
//   コンポーネントの表示後にタイマーを動かすために使うぽよん
//
// useState:
//   現在のコードでは使っていないので削除してよいぽよん
import { useEffect } from "react";


/*
 * DreamBubbleが親コンポーネントから受け取る値の型ぽよん
 */
type DreamBubbleProps = {

  // 泡の中に表示する会話テキストぽよん
  text: string;

  // 誰の発話なのかを表すぽよん
  //
  // 将来的には、
  // user  → 画面下から泡が出る
  // poyon → ぽよんの頭上から泡が出る
  //
  // のように演出を分けるために使えるぽよん
  from: "user" | "poyon";

  // DreamBubbleの演出終了後に、
  // DreamSceneへ「この泡を削除してよいぽよん」と伝える関数ぽよん
  onDone: () => void;
};


export default function DreamBubble({
  text,
  from,
  onDone,
}: DreamBubbleProps) {

  /*
   * DreamBubbleが画面に生成されたときに実行されるぽよん
   *
   * 12秒後にonDone()を呼んで、
   * DreamScene側のbubbles配列から
   * このDreamBubbleを削除してもらうぽよん
   */
  useEffect(() => {

    // 12000ミリ秒 = 12秒後に実行するタイマーぽよん
    const timer = window.setTimeout(() => {
      onDone();
    }, 12000);


    /*
     * DreamBubbleが12秒より前に削除された場合などに、
     * 残ったタイマーを解除するための後片付け処理ぽよん
     */
    return () => {
      window.clearTimeout(timer);
    };

  }, [onDone]);


  return (
    /*
     * DreamBubble全体のコンテナぽよん
     *
     * この中に、
     *
     * ① 小さなキラキラ泡
     * ② 雲＋テキスト
     *
     * の2つが入っているぽよん
     */
    <div
      className="dreamBubble"

      /*
       * fromは今後、
       * userとpoyonで演出を分けるときに使うぽよん
       *
       * 現時点ではCSSには使っていないけれど、
       * data-fromとしてHTMLに持たせておくぽよん
       */
      data-from={from}
    >

      {/*
       * 最初に上昇する小さなキラキラ泡ぽよん
       *
       * 中に文字はないので自己終了タグでOKぽよん
       */}
      <div className="tinyBubble" />


      {/*
       * 約1秒後に出現する、
       * カラフルな雲と会話テキストぽよん
       */}
      <div className="cloudText">
        {text}
      </div>


      <style jsx>{`

        /*
         * ==================================================
         * DreamBubble全体
         * ==================================================
         */

        .dreamBubble {

          /*
           * DreamSceneを基準に絶対配置するぽよん
           */
          position: absolute;


          /*
           * 横方向は画面中央ぽよん
           *
           * wholeLifeアニメーション内の
           * translateX(-50%)と組み合わせて
           * 本当の中央位置になるぽよん
           */
          left: 50%;


          /*
           * 画面下から12%の位置を
           * 泡演出の開始地点にするぽよん
           */
          bottom: 78%;


          /*
           * 背景や通常オブジェクトより前面に表示するぽよん
           */
          z-index: 40;


          /*
           * DreamBubble自身はクリックを奪わないぽよん
           *
           * 泡が表示されていても、
           * 背後のぽよんやオブジェクトをクリックできるぽよん
           */
          pointer-events: none;


          /*
           * DreamBubble全体を12秒かけて
           * 少しだけ上方向へ漂わせるぽよん
           */
          animation: wholeLife 12s ease-out forwards;
        }



        /*
         * ==================================================
         * 小さなキラキラ泡
         * ==================================================
         */

        .tinyBubble {

          /*
           * 小さな泡のサイズぽよん
           */
          width: 10px;
          height: 10px;


          /*
           * 円形にするぽよん
           *
           * 9999pxのような十分大きな値を指定すると、
           * 正方形要素は円になるぽよん
           */
          border-radius: 9999px;


          /*
           * 初期状態では透明ぽよん
           *
           * tinyRiseアニメーションによって
           * 一瞬だけ見えるようになるぽよん
           */
          opacity: 0;


          /*
           * 3つのradial-gradientを重ねて、
           * 1つの小さな泡の中に
           *
           * 白
           * ピンク
           * 水色
           *
           * の光を作っているぽよん
           */
          background:
            radial-gradient(
              circle at 30% 30%,
              rgba(255, 255, 255, 0.95),
              transparent 35%
            ),

            radial-gradient(
              circle at 70% 60%,
              rgba(255, 190, 230, 0.6),
              transparent 45%
            ),

            radial-gradient(
              circle at 40% 80%,
              rgba(180, 220, 255, 0.5),
              transparent 50%
            );


          /*
           * 泡の周囲に淡い光を追加するぽよん
           *
           * 2種類のbox-shadowを重ねて
           * 白い光と紫系の光を作っているぽよん
           */
          box-shadow:
            0 0 8px rgba(255, 255, 255, 0.8),
            0 0 14px rgba(210, 190, 255, 0.5);


          /*
           * 1.5秒間、
           * tinyRiseアニメーションを実行するぽよん
           */
          animation: tinyRise 1.5s ease-out forwards;
        }



        /*
         * ==================================================
         * 雲＋会話テキスト
         * ==================================================
         */

        .cloudText {

          /*
           * dreamBubbleを基準に絶対配置するぽよん
           */
          position: absolute;


          /*
           * 親要素の中央に配置するぽよん
           */
          left: 50%;


          /*
           * 小さな泡の少し上に表示するぽよん
           */
          top: -36px;


          /*
           * left: 50% だけだと要素の左端が中央になるので、
           * 自分自身の幅の半分だけ左へ戻すぽよん
           */
          transform: translateX(-50%);


          /*
           * 雲の最小幅ぽよん
           *
           * 短い文章でも小さくなりすぎないようにするぽよん
           */
          min-width: 180px;


          /*
           * 長文時に横へ伸びすぎないようにするぽよん
           */
          max-width: 420px;


          /*
           * テキストと雲の端の間に余白を作るぽよん
           */
          padding: 18px 24px;


          /*
           * 大きな角丸で雲の基本形を作るぽよん
           */
          border-radius: 9999px;


          /*
           * 最初は透明ぽよん
           *
           * cloudAppearアニメーションで出現するぽよん
           */
          opacity: 0;


          /*
           * 少し透明な白文字ぽよん
           *
           * 完全な白より夜空になじみやすいぽよん
           */
          color: rgba(255, 255, 255, 0.92);


          /*
           * テキストサイズぽよん
           */
          font-size: 15px;


          /*
           * 行間を少し広めにして、
           * 夢っぽくゆったり読めるようにするぽよん
           */
          line-height: 1.8;


          /*
           * テキスト中央揃えぽよん
           */
          text-align: center;


          /*
           * 改行を保持しつつ、
           * 長い文章は折り返すぽよん
           */
          white-space: pre-wrap;


          /*
           * 複数のradial-gradientを重ねて、
           *
           * 青紫
           * ピンク紫
           * 水色
           *
           * の淡いカラフル雲を作っているぽよん
           */
          background:
            radial-gradient(
              circle at 20% 50%,
              rgba(211, 220, 255, 0.72),
              transparent 42%
            ),

            radial-gradient(
              circle at 50% 35%,
              rgba(245, 210, 255, 0.64),
              transparent 44%
            ),

            radial-gradient(
              circle at 80% 55%,
              rgba(198, 238, 255, 0.62),
              transparent 46%
            ),

            rgba(230, 225, 255, 0.22);


          /*
           * ごくわずかなぼかしぽよん
           *
           * 0.1pxなのでほぼシャープな状態ぽよん
           */
          filter: blur(0.1px);


          /*
           * 雲の後ろにある夜空をぼかすぽよん
           *
           * 半透明の雲に奥行きが出るぽよん
           */
          backdrop-filter: blur(6px);


          /*
           * 雲の周囲に淡い光を追加するぽよん
           */
          box-shadow:
            0 0 24px rgba(210, 220, 255, 0.22),
            0 0 42px rgba(255, 210, 245, 0.12);


          /*
           * 雲の出現から消滅までのアニメーションぽよん
           *
           * 11秒間動作し、
           * 1秒待ってから開始するぽよん
           */
          animation: cloudAppear 11s ease-out forwards;
          animation-delay: 1s;
        }



        /*
         * ==================================================
         * 小さな泡の上昇アニメーション
         * ==================================================
         */

        @keyframes tinyRise {

          /*
           * 開始時点
           *
           * 小さくて透明な状態ぽよん
           */
          0% {
            opacity: 0;
            transform: translateY(0) scale(0.4);
          }


          /*
           * 少し見えるようになるぽよん
           */
          25% {
            opacity: 0.45;
          }


          /*
           * 34px上昇しながら少し大きくなるぽよん
           */
          50% {
            opacity: 0.65;
            transform: translateY(-34px) scale(0.7);
          }


          /*
           * 70px上昇したところで、
           * 少し膨らみながら透明になるぽよん
           */
          100% {
            opacity: 0;
            transform: translateY(-70px) scale(1.2);
          }
        }



        /*
         * ==================================================
         * 雲＋テキストの出現・消滅アニメーション
         * ==================================================
         */

        @keyframes cloudAppear {

          /*
           * 出現直前ぽよん
           *
           * 少し小さく、
           * ぼやけて、
           * 透明な状態ぽよん
           */
          0% {
            opacity: 0;

            transform:
              translate(-50%, 6px)
              scale(0.92);

            filter: blur(8px);
          }


          /*
           * 雲が「もわっ」と現れる部分ぽよん
           *
           * animation全体が11秒なので、
           * 8%は約0.88秒ぽよん
           */
          8% {
            opacity: 0.92;

            transform:
              translate(-50%, 0)
              scale(1);

            filter: blur(0.1px);
          }


          /*
           * しばらく雲を見せておくぽよん
           */
          70% {
            opacity: 0.82;
          }


          /*
           * 最後は少し上昇・拡大・ぼかしながら
           * 夜空へ溶けるぽよん
           */
          100% {
            opacity: 0;

            transform:
              translate(-50%, -18px)
              scale(1.04);

            filter: blur(7px);
          }
        }



        /*
         * ==================================================
         * DreamBubble全体の漂い
         * ==================================================
         */

        @keyframes wholeLife {

          /*
           * 開始位置ぽよん
           *
           * X方向は自身の幅の50%戻して中央揃えするぽよん
           */
          0% {
            transform: translate(-50%, 0);
          }


          /*
           * 12秒かけて20pxだけ上へ漂うぽよん
           */
          100% {
            transform: translate(-50%, -20px);
          }
        }

      `}</style>
    </div>
  );
}