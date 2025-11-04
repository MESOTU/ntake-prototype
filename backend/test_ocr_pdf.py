import sys
import os
sys.path.append(os.getcwd())

from main import extract_text_with_ocr

# Test with a simple function call
def test_ocr():
    print("🧪 Testing OCR with a PDF file...")
    
    # You'll need to provide a PDF file path here
    pdf_path = input("Enter path to test PDF file: ").strip()
    
    if not os.path.exists(pdf_path):
        print(f"❌ File not found: {pdf_path}")
        return
    
    try:
        with open(pdf_path, 'rb') as f:
            text = extract_text_with_ocr(f)
            print(f"✅ OCR completed!")
            print(f"📄 Extracted {len(text)} characters")
            print(f"📝 First 500 chars:\n{text[:500]}...")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_ocr()
