import sqlite3

con = sqlite3.connect("data/auth.db")
for username, password_hash in con.execute("SELECT username, password_hash FROM users"):
    print(username, password_hash)