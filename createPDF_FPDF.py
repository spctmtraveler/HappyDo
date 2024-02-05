from fpdf import FPDF
import os

class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 12)

    def add_intro(self, text):
        self.add_page()
        self.set_font('Arial', 'B', 12)
        self.multi_cell(0, 10, 'Introduction')
        self.set_font('Arial', '', 10)
        self.multi_cell(0, 10, text)

    def add_file(self, file_path):
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                self.add_page()
                self.set_font('Arial', 'B', 10)
                self.multi_cell(0, 10, f"File: {file_path}")
                content = file.read()
                self.set_font('Arial', '', 10)
                self.multi_cell(0, 10, content)
                print(f"Added {file_path} to PDF")
        except Exception as e:
            print(f"Error adding {file_path}: {e}")

def create_code_pdf(source_folder, output_pdf):
    intro_text = ("File Overview: This file contains a dump of most of the "
                  "codebase files for a task management app in development. "
                  "It contains one file after the other. Each file has the "
                  "filename listed at the top before the file contents. The "
                  "code stack includes PHP, HTML, CSS, Javascript. I'm developing "
                  "locally on my PC in VS Code. I coded a lot in the past, but "
                  "I'm a beginner in many things as I start coding again.")
    
    pdf = PDF()
    pdf.add_intro(intro_text)
    
    for root, dirs, files in os.walk(source_folder):
        for file in files:
            if file.endswith(('.html', '.php', '.css', '.js')):
                file_path = os.path.join(root, file)
                pdf.add_file(file_path)
                
    pdf.output(output_pdf)
    print("PDF creation completed successfully!")

# Usage example
create_code_pdf('.', 'combined_local_code.pdf')
