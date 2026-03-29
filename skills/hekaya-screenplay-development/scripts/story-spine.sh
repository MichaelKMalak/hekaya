#!/bin/bash
# Interactive Pixar Story Spine generator
# Walks you through the 8 beats of the Story Spine in Egyptian Arabic
# Usage: ./story-spine.sh [output-file]

OUTPUT="${1:-story-spine.md}"

echo "=== العمود الفقري للقصة (Story Spine) ==="
echo "اكتب جملة لكل خطوة. اضغط Enter للتأكيد."
echo ""

read -p "كان ياما كان في... " ONCE
read -p "وكل يوم... " EVERY_DAY
read -p "لحد ما في يوم... " ONE_DAY
read -p "وعشان كده... (١) " BECAUSE1
read -p "وعشان كده... (٢) " BECAUSE2
read -p "وعشان كده... (٣) " BECAUSE3
read -p "لحد ما في الآخر... " FINALLY
read -p "ومن ساعتها... " EVER_SINCE

cat > "$OUTPUT" << EOF
# العمود الفقري للقصة — Story Spine

كان ياما كان في **$ONCE**.
وكل يوم **$EVERY_DAY**.
لحد ما في يوم **$ONE_DAY**.
وعشان كده **$BECAUSE1**.
وعشان كده **$BECAUSE2**.
وعشان كده **$BECAUSE3**.
لحد ما في الآخر **$FINALLY**.
ومن ساعتها **$EVER_SINCE**.

---

## ملاحظات

- اللوجلاين:
- الثيم:
- CDQ:
EOF

echo ""
echo "Saved to: $OUTPUT"
