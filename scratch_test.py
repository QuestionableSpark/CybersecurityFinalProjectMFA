from api.auth import hash_password, verify_password

h1 = hash_password("practice password")
h2 = hash_password("practice password")

print(h1)
print(h2)
print("Hashes are equal:", h1 == h2)
print("Right password:", verify_password(h1, "practice password"))
print("Wrong password:", verify_password(h1, "wrong password"))
