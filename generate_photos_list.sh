#!/bin/sh
# Generate photos.json from files in static/image directory

# Since we are copying 'static' content to '/usr/share/nginx/html'
TARGET_DIR="/usr/share/nginx/html/image" 
OUTPUT_FILE="$TARGET_DIR/photos.json"

if [ ! -d "$TARGET_DIR" ]; then
    echo "Directory $TARGET_DIR does not exist. Listing /usr/share/nginx/html:"
    ls -R /usr/share/nginx/html
    exit 1
fi

echo "Generating photo list in $OUTPUT_FILE..."

# Start JSON array
echo "[" > "$OUTPUT_FILE"

# Find files, exclude directories and the json file itself
first=true
for file in "$TARGET_DIR"/*; do
    filename=$(basename "$file")
    
    # Skip directories, the output file itself, and the icon folder
    if [ -d "$file" ] || [ "$filename" = "photos.json" ]; then
        continue
    fi
    
    # Check for image extensions (case insensitive simplistic check)
    case "$filename" in
        *.jpg|*.jpeg|*.png|*.gif|*.webp|*.JPG|*.JPEG|*.PNG|*.GIF|*.WEBP)
            if [ "$first" = true ]; then
                first=false
            else
                echo "," >> "$OUTPUT_FILE"
            fi
            echo "  \"$filename\"" >> "$OUTPUT_FILE"
            ;;
    esac
done

# End JSON array
echo "]" >> "$OUTPUT_FILE"

echo "Done. Generated photos.json with content:"
cat "$OUTPUT_FILE"
