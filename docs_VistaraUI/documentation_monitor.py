#!/usr/bin/env python3
"""
Vistara UI Documentation Monitor
מערכת ניטור תיעוד - מזהה קבצי מדריכים מחוץ לתיקיית docs_VistaraUI

Created by: Moss - Documentation Specialist
Purpose: לוודא שכל התיעוד נמצא במקום המתאים
"""

import os
import glob
import datetime
import json
from pathlib import Path

class DocumentationMonitor:
    def __init__(self, project_root="/Users/zvishilovitsky/vistara-ui"):
        self.project_root = Path(project_root)
        self.docs_folder = self.project_root / "docs_VistaraUI"
        
        # מילות מפתח לזיהוי קבצי תיעוד
        self.doc_keywords = [
            'guide', 'guides', 'guidance', 'tutorial', 'tutorials',
            'manual', 'manuals', 'instruction', 'instructions',
            'documentation', 'docs', 'doc', 'readme', 'howto',
            'setup', 'install', 'config', 'configuration',
            'help', 'faq', 'troubleshoot', 'troubleshooting',
            'component', 'components', 'ui', 'design', 'system',
            'migration', 'deploy', 'development', 'dev',
            'מדריך', 'מדריכים', 'הוראות', 'הנחיות',
            'תיעוד', 'הסבר', 'התקנה', 'הגדרה', 'רכיבים',
            'עיצוב', 'מערכת', 'פיתוח'
        ]
        
        # סוגי קבצים לבדיקה
        self.doc_extensions = ['.md', '.txt', '.rst', '.adoc']
        
        # תיקיות מותרות (לא נבדקות)
        self.allowed_folders = {
            'docs_VistaraUI',  # התיקיה הרשמית שלנו
            '.git',  # Git metadata
            'node_modules',  # Dependencies
            '__pycache__',  # Python cache
            '.vscode',  # IDE files
            '.idea',  # IDE files
            'venv',  # Virtual environment
            'env',  # Environment
            'build',  # Build output
            'dist',  # Distribution
            'coverage'  # Test coverage
        }

    def is_documentation_file(self, file_path):
        """בודק אם קובץ הוא קובץ תיעוד"""
        file_path = Path(file_path)
        
        # בדיקה לפי סיומת
        if file_path.suffix.lower() not in self.doc_extensions:
            return False
            
        # בדיקה לפי שם הקובץ
        filename_lower = file_path.name.lower()
        
        # בדיקה של מילות מפתח בשם הקובץ
        for keyword in self.doc_keywords:
            if keyword in filename_lower:
                return True
                
        # בדיקה מיוחדת לקבצי README
        if filename_lower.startswith('readme'):
            return True
            
        return False

    def is_in_allowed_folder(self, file_path):
        """בודק אם הקובץ נמצא בתיקיה מותרת"""
        file_path = Path(file_path)
        
        # בדיקה אם הקובץ בתוך docs_VistaraUI
        try:
            file_path.relative_to(self.docs_folder)
            return True
        except ValueError:
            pass
            
        # בדיקה של תיקיות מותרות אחרות
        for part in file_path.parts:
            if part in self.allowed_folders:
                return True
                
        return False

    def scan_project(self):
        """סורק את כל הפרויקט ומחזיר רשימת קבצי תיעוד חריגים"""
        problematic_files = []
        
        print(f"🔍 סורק פרויקט: {self.project_root}")
        print(f"📁 תיקיית docs רשמית: {self.docs_folder}")
        print("-" * 60)
        
        # סריקה רקורסיבית של כל הפרויקט
        for root, dirs, files in os.walk(self.project_root):
            # דילוג על תיקיות שלא רלוונטיות
            dirs[:] = [d for d in dirs if d not in {'.git', 'node_modules', '__pycache__', '.vscode', '.idea', 'venv', 'env', 'build', 'dist', 'coverage'}]
            
            for file in files:
                file_path = Path(root) / file
                
                # בדיקה אם זה קובץ תיעוד
                if self.is_documentation_file(file_path):
                    # בדיקה אם הוא במקום המותר
                    if not self.is_in_allowed_folder(file_path):
                        problematic_files.append({
                            'path': str(file_path),
                            'relative_path': str(file_path.relative_to(self.project_root)),
                            'filename': file_path.name,
                            'size': file_path.stat().st_size if file_path.exists() else 0,
                            'modified': datetime.datetime.fromtimestamp(file_path.stat().st_mtime).isoformat() if file_path.exists() else None
                        })
        
        return problematic_files

    def generate_report(self, problematic_files):
        """יוצר דוח מפורט על הקבצים החריגים"""
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        report = f"""
# 🎨 דוח ניטור תיעוד Vistara UI
**תאריך:** {timestamp}
**סטטוס:** {'🟢 תקין' if not problematic_files else '🔴 נמצאו בעיות'}

## 📊 סיכום
- **קבצי תיעוד חריגים:** {len(problematic_files)}
- **תיקיית תיעוד רשמית:** `docs_VistaraUI/`

"""

        if problematic_files:
            report += """
## 🔴 קבצי תיעוד שנמצאו מחוץ לתיקיית docs_VistaraUI

| קובץ | מיקום | גודל | עדכון אחרון |
|------|-------|------|-------------|
"""
            for file_info in problematic_files:
                size_kb = round(file_info['size'] / 1024, 1) if file_info['size'] > 0 else 0
                modified_date = file_info['modified'][:10] if file_info['modified'] else 'N/A'
                report += f"| `{file_info['filename']}` | `{file_info['relative_path']}` | {size_kb}KB | {modified_date} |\n"

            report += f"""
## 🔧 פעולות מומלצות
1. **בדוק כל קובץ** - האם זה באמת תיעוד שצריך להיות ב-docs_VistaraUI?
2. **העבר לתיקיה הנכונה** - אם כן, העבר לקטגוריה המתאימה (01-09)
3. **עדכן פורמט** - וודא שהקובץ עומד בתבנית הסטנדרטית
4. **מחק כפילויות** - אם יש גרסה חדשה ב-docs_VistaraUI
5. **עקוב אחר כלל "NO README"** - השתמש בשמות קבצים תיאוריים

"""
        else:
            report += """
## ✅ מצוין! 
כל קבצי התיעוד נמצאים במקום הנכון.
לא נמצאו קבצי תיעוד מחוץ לתיקיות המותרות.

## 🎯 מצב נוכחי
- כל התיעוד ב-`docs_VistaraUI/`
- מבנה תיקיות מסודר (01-09)
- ללא כפילויות 
- ללא קבצי README מיותרים
"""

        report += f"""
---
**נוצר על ידי:** Moss Documentation Monitor  
**פרויקט:** Vistara UI  
**גרסה:** 1.0  
**מבוסס על:** TitanMind Documentation Monitor
"""
        
        return report

    def save_report(self, report, filename=None):
        """שומר דוח בקובץ"""
        if filename is None:
            timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"documentation_scan_{timestamp}.md"
            
        report_path = self.docs_folder / filename
        
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write(report)
            
        return report_path

def main():
    """פונקציה ראשית"""
    print("🌱 Moss Documentation Monitor - Vistara UI")
    print("🎨 \"Command your Design\" - Documentation Monitoring")
    print("=" * 60)
    
    monitor = DocumentationMonitor()
    
    # סריקת הפרויקט
    problematic_files = monitor.scan_project()
    
    # יצירת דוח
    report = monitor.generate_report(problematic_files)
    
    # הדפסת התוצאות
    print(report)
    
    # שמירת דוח
    report_path = monitor.save_report(report, "latest_documentation_scan.md")
    print(f"\n💾 דוח נשמר ב: {report_path}")
    
    # התראה אם נמצאו בעיות
    if problematic_files:
        print(f"\n🚨 נמצאו {len(problematic_files)} קבצי תיעוד חריגים!")
        print("📝 עיין בדוח לפרטים מלאים")
        return 1
    else:
        print("\n✅ כל התיעוד במקום הנכון!")
        return 0

if __name__ == "__main__":
    exit(main())