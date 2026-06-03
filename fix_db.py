import sqlite3

db_path = r"C:\adso-3278641-4t\CompanyEmployees_Onion\database.db"

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("DROP TABLE IF EXISTS refresh_tokens;")
    conn.commit()
    conn.close()
    print("Tabla 'refresh_tokens' eliminada con éxito para reanudar la migración.")
except Exception as e:
    print(f"Error al limpiar la base de datos: {e}")
