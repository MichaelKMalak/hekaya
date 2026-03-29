#!/bin/bash
# Create a new .hekaya screenplay file from template
# Usage: ./new-screenplay.sh [filename] [title] [author]

FILENAME="${1:-screenplay}.hekaya"
TITLE="${2:-عنوان السيناريو}"
AUTHOR="${3:-$(git config user.name 2>/dev/null || echo 'المؤلف')}"
DATE=$(date +%Y/%m/%d)

if [ -f "$FILENAME" ]; then
    echo "Error: $FILENAME already exists."
    exit 1
fi

cat > "$FILENAME" << EOF
العنوان: $TITLE
سيناريو: $AUTHOR
مسودة: المسودة الأولى
تاريخ: $DATE

داخلي - [المكان] - نهار

[وصف المشهد]

@[اسم الشخصية]
[الحوار]

EOF

echo "Created: $FILENAME"
echo "  Title: $TITLE"
echo "  Author: $AUTHOR"
echo "  Date: $DATE"
