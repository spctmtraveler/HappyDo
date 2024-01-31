from fpdf import FPDF
import os

class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 12)

    def add_file(self, file_path):
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                self.add_page()
                self.multi_cell(0, 10, file_path)
                content = file.read()
                self.set_font('Arial', '', 10)
                self.multi_cell(0, 10, content)
        except Exception as e:
            print(f"Error adding {file_path}: {e}")

def create_code_pdf(source_folder, output_pdf):
    pdf = PDF()
    for root, dirs, files in os.walk(source_folder):
        for file in files:
            if file.endswith(('.html', '.php', '.css', '.js')):
                file_path = os.path.join(root, file)
                pdf.add_file(file_path)
    pdf.output(output_pdf)

# Usage example
create_code_pdf('.', 'combined_local_code.pdf')
