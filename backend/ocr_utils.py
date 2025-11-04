import pytesseract
from pdf2image import convert_from_path

def extract_text_from_scanned_pdf(pdf_path):
    try:
        images = convert_from_path(pdf_path, dpi=300)
        full_text = ""
        for i, image in enumerate(images):
            text = pytesseract.image_to_string(image)
            full_text += f"--- Page {i+1} ---\n{text}\n"
        return full_text.strip()
    except Exception as e:
        return f"Error: {str(e)}"