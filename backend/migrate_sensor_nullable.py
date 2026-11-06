
import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent / "data" / "freshguard.db"

conn = sqlite3.connect(DB_PATH)

try:
    conn.execute("PRAGMA foreign_keys = OFF")
    conn.execute("BEGIN")

    columns = {
        row[1]: row
        for row in conn.execute("PRAGMA table_info(sensor_readings)")
    }

    if not columns:
        raise RuntimeError("sensor_readings table not found")

    gas_nullable = columns["gas"][3] == 0
    ph_nullable = columns["ph"][3] == 0

    if gas_nullable and ph_nullable:
        print("Migration already applied. No changes needed.")
        conn.rollback()
    else:
        conn.execute("""
            CREATE TABLE sensor_readings_new (
                id INTEGER PRIMARY KEY,
                food_id INTEGER NOT NULL,
                gas FLOAT,
                ph FLOAT,
                temperature FLOAT NOT NULL,
                humidity FLOAT NOT NULL,
                timestamp DATETIME NOT NULL,
                FOREIGN KEY(food_id) REFERENCES foods(id)
            )
        """)

        conn.execute("""
            INSERT INTO sensor_readings_new
                (id, food_id, gas, ph, temperature, humidity, timestamp)
            SELECT
                id, food_id, gas, ph, temperature, humidity, timestamp
            FROM sensor_readings
        """)

        conn.execute("DROP TABLE sensor_readings")
        conn.execute(
            "ALTER TABLE sensor_readings_new RENAME TO sensor_readings"
        )

        conn.execute("""
            CREATE INDEX IF NOT EXISTS ix_sensor_readings_id
            ON sensor_readings (id)
        """)
        conn.execute("""
            CREATE INDEX IF NOT EXISTS ix_sensor_readings_food_id
            ON sensor_readings (food_id)
        """)

        conn.commit()
        print("Migration successful. Existing readings preserved.")

    print("Total readings:", conn.execute(
        "SELECT COUNT(*) FROM sensor_readings"
    ).fetchone()[0])

finally:
    conn.close()
