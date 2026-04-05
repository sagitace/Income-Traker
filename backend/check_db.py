import sqlite3

db = sqlite3.connect('income_tracker.db')
cursor = db.cursor()

print('=' * 50)
print('DATABASE STRUCTURE AND DATA')
print('=' * 50)

# Get all tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()

print('\nTABLES IN DATABASE:')
for table in tables:
    table_name = table[0]
    cursor.execute(f'SELECT COUNT(*) FROM {table_name}')
    count = cursor.fetchone()[0]
    print(f'\n  ✓ {table_name}: {count} rows')
    
    # Get columns
    cursor.execute(f"PRAGMA table_info({table_name});")
    columns = cursor.fetchall()
    print(f'    Columns:')
    for col in columns:
        col_name, col_type = col[1], col[2]
        print(f'      - {col_name} ({col_type})')
    
    # Show sample data if any
    if count > 0:
        cursor.execute(f'SELECT * FROM {table_name} LIMIT 3;')
        rows = cursor.fetchall()
        print(f'    Sample data (first 3 rows):')
        for row in rows:
            print(f'      {row}')

print('\n' + '=' * 50)
db.close()
