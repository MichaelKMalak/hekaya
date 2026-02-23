---
sidebar_position: 2
title: Bilingual Example
---

# Bilingual Example (Arabic + English)

A Hekaya screenplay demonstrating mixed Arabic and English content.

## Source (`.hekaya`)

```
العنوان: The Last Meeting
المؤلف: سمير عبدالحميد
مسودة: First Draft

داخلي - مكتب شركة أجنبية - نهار

مكتب حديث في برج بزنس في القاهرة الجديدة. سمير قاعد قصاد مكتب كبير. DAVID جالس خلف المكتب.

DAVID
So, Samir, tell me about your experience.

@سمير
(بإنجليزي مكسر)
I have... five years experience. In the... كيف أقول...
(بالعربي لنفسه)
يا ربي ليه مذاكرتش كويس.
(يرجع للإنجليزي)
In the marketing field.

DAVID
(smiling)
Your Arabic is much better than my Arabic, I'm sure.

@سمير
(يضحك)
شكراً. I mean, thank you.

DAVID
The position requires someone who can bridge both cultures. Egyptian and Western.

@سمير
(بثقة أكتر)
That is exactly what I do. أنا اتعلمت إزاي أخلي الناس من كل مكان يفهموا بعض.

DAVID
When can you start?

سمير مش مصدق. بيبتسم.

@سمير
(بسرعة)
Tomorrow! I mean...
(بيهدي نفسه)
Whenever works best for the team.

>CUT TO:
```

## Elements Demonstrated

| Element              | Example                            | Notes                                   |
| -------------------- | ---------------------------------- | --------------------------------------- |
| Mixed title page     | Arabic `العنوان` + English `Draft` | Both key types work                     |
| Arabic scene heading | `داخلي - مكتب شركة أجنبية - نهار`  | Arabic keyword                          |
| English character    | `DAVID`                            | UPPERCASE detection (Fountain standard) |
| Arabic character     | `@سمير`                            | `@` prefix                              |
| Mixed dialogue       | English + Arabic in same speech    | BiDi handles inline                     |
| English transition   | `CUT TO:`                          | Fountain standard                       |
