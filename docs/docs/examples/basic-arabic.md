---
sidebar_position: 1
title: Basic Arabic Example
---

# Basic Arabic Example

A minimal Hekaya screenplay demonstrating core elements in Egyptian Arabic.

## Source (`.hekaya`)

```
العنوان: صباح الخير يا مصر
المؤلف: سمير عبدالحميد

داخلي - قهوة بلدي - صباح

قهوة بلدي صغيرة في حي شعبي. الشمس داخلة من الشباك. ريحة القهوة مالية المكان.

@سمير
(للجرسون)
قهوة مظبوط، لو سمحت.

@الجرسون
حاضر يا بيه.

الجرسون بيمشي. سمير بيفتح جرنال قديم. نادية بتدخل القهوة.

@نادية
(مستغربة)
سمير؟ أنت بتعمل إيه هنا الصبح ده؟

@سمير
(من غير ما يبص من الجرنال)
بشرب قهوة. إنتِ فاكرة إيه؟

نادية بتقعد قصاده.

@نادية
(بجدية)
لازم نتكلم.

@سمير
(بيبص عليها أخيراً)
عن إيه؟

@نادية
عن الموضوع اللي إنت عارفه.

لحظة صمت. سمير بيقفل الجرنال.

@سمير
(بهدوء)
خلاص. اتكلمي.

- قطع -
```

## Elements Demonstrated

| Element       | Example                       | Detection Method               |
| ------------- | ----------------------------- | ------------------------------ |
| Title page    | `العنوان: صباح الخير يا مصر`  | Arabic key mapping             |
| Scene heading | `داخلي - قهوة بلدي - صباح`    | Arabic keyword `داخلي`         |
| Action        | `قهوة بلدي صغيرة في حي شعبي.` | Default (no marker)            |
| Character     | `@سمير`                       | `@` prefix                     |
| Parenthetical | `(للجرسون)`                   | Parentheses in dialogue        |
| Dialogue      | `قهوة مظبوط، لو سمحت.`        | After character element        |
| Transition    | `- قطع -`                     | Standalone keyword with dashes |
