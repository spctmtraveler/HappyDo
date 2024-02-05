import os
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

def add_file_to_pdf(pdf, file_path, y_position):
    # Set a smaller font size
    pdf.setFont("Courier", 10)
    with open(file_path, 'r', encoding='utf-8') as file:
        print(f"Adding {file_path} to PDF.")
        lines = file.readlines()
        pdf.drawString(100, y_position, f"File: {file_path}")  # Add file path as a header
        y_position -= 12  # Space before content starts
        for line in lines:
            if y_position < 40:  # Check for end of page
                pdf.showPage()
                y_position = 750  # Reset y_position for the new page
                pdf.setFont("Courier", 10)  # Reset font size for new page
            pdf.drawString(100, y_position, line)
            y_position -= 12  # Move to the next line
    return y_position

def create_code_pdf(source_folder, output_pdf):
    pdf = canvas.Canvas(output_pdf, pagesize=letter)
    pdf.setTitle("Code Files")
    y_position = 750

    for root, dirs, files in os.walk(source_folder):
        for file in files:
            if file.endswith(('.html', '.php', '.css', '.js')):
                file_path = os.path.join(root, file)
                y_position = add_file_to_pdf(pdf, file_path, y_position)
                pdf.showPage()  # Add a page break after each file
                y_position = 750  # Reset y_position for the new page

    pdf.save()
    print(f"PDF saved as {output_pdf}.")

# Usage example
create_code_pdf('.', 'combined_local_code2.pdf')
