#!/bin/bash

# Function to clean up temporary files
cleanup() {
    # Remove the temporary markdown and header files
    rm -f header.txt temp_file temp_file.md
    
    # The temporary PDFs should be deleted after attempting to merge
    if [ -s "$pdf_list" ]; then
        while read -r pdf; do
            rm -f "$pdf"
        done < "$pdf_list"
    fi
    # Remove the list file itself
    rm -f "$pdf_list"
}


# Trap to execute the cleanup function on script exit
trap cleanup EXIT

# Update package list
sudo apt-get update

# Install full TeX Live distribution
sudo apt-get install -y texlive-full

# Check and install Pandoc and PDF Unite if they are not installed
which pandoc || sudo apt-get install -y pandoc
which pdfunite || sudo apt-get install -y poppler-utils

# Create a temporary file to hold the names of the PDFs
pdf_list=$(mktemp)

# Directories containing your files
DIRECTORIES=("models" "public")

# Function to escape file names
escape_filename() {
    echo "$1" | sed -e 's/\./_/g'
}

# Convert all HTML, PHP, CSS, and JS files in the directories to PDF
for dir in "${DIRECTORIES[@]}"; do
    find "$dir" -type f \( -name "*.html" -o -name "*.php" -o -name "*.css" -o -name "*.js" \) | while read file; do
        echo "Processing file: $file"
        
        # Use the escape function to generate the PDF filename
        base_name=$(basename "$file")
        escaped_file_name=$(escape_filename "$base_name")
        pdf_file="${dir}/${escaped_file_name}.pdf"

        # Depending on file type, process differently
        case "$file" in
            *.html | *.php)
                # Add a header before each file's content
                echo "### Following is the Code for ${escaped_file_name} ###" > temp_file.md
                # Add the file content as a code block to the markdown
                echo '```php' >> temp_file.md
                cat "$file" >> temp_file.md
                echo '```' >> temp_file.md
                # Convert to PDF using pandoc with xelatex engine
                pandoc temp_file.md --pdf-engine=xelatex -o "$pdf_file"
                ;;
            *.css | *.js)
                # Add a header before each file's content
                echo "+++++++" > temp_file.md
                echo "+++++++ FOLLOWING IS THE CODE FOR ${escaped_file_name} +++++" > temp_file.md
                echo "+++++++" > temp_file.md
                # Add the file content as a code block to the markdown
                echo '```' >> temp_file.md
                cat "$file" >> temp_file.md
                echo '```' >> temp_file.md
                # Convert to PDF using pandoc with xelatex engine
                pandoc temp_file.md --pdf-engine=xelatex -o "$pdf_file"
                ;;
        esac

        # Append the PDF filename to the temporary file if conversion was successful
        if [ -f "$pdf_file" ]; then
            echo "$pdf_file" >> "$pdf_list"
        else
            echo "Conversion failed for $file"
        fi
    done
done

# Check if the temporary file has contents before attempting to read it
if [ -s "$pdf_list" ]; then
    echo "The temporary file contains:"
    cat "$pdf_list"

    # Read the list of PDF filenames into an array
    readarray -t pdfs < "$pdf_list"
    echo "The array of PDFs contains: ${pdfs[*]}"

    # Merge all PDFs if there are any
    if [ ${#pdfs[@]} -gt 0 ]; then
         if pdfunite "${pdfs[@]}" combined.pdf; then
            echo "PDF creation complete. Your file is combined.pdf"
        else
            echo "Failed to merge PDFs."
        fi
       
        # Cleanup temporary PDFs after merge attempt
        cleanup
    else
        echo "No PDFs to merge."
    fi
else
    echo "The temporary file is empty or does not exist."
fi

# Clean up the temporary file
rm -f "$pdf_list"

# End of the script
