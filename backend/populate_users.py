import asyncio
from prisma import Prisma

async def populate_users():
    """
    Populează tabela User cu:
    - 5 employee (employee_1 ... employee_5)
    - 2 manageri (manager_1, manager_2)
    - 1 admin (admin_1)
    
    Pentru fiecare user, parola = numele, avatar = ""
    """
    prisma = Prisma()
    await prisma.connect()
    
    try:
        # Ștergem toate înregistrările existente
        deleted = await prisma.user.delete_many()
        print(f"🗑️  Am șters {deleted} utilizatori existenți")
        
        # Resetăm contorul autoincrement în SQLite
        await prisma.execute_raw('DELETE FROM sqlite_sequence WHERE name = "User";')
        print(f"🔄 Am resetat contorul autoincrement\n")
        
        users_to_create = []
        
        # 5 employees
        for i in range(1, 6):
            users_to_create.append({
                "name": f"employee_{i}",
                "password": f"employee_{i}",
                "avatar": ""
            })
        
        # 2 manageri
        for i in range(1, 3):
            users_to_create.append({
                "name": f"manager_{i}",
                "password": f"manager_{i}",
                "avatar": ""
            })
        
        # 1 admin
        users_to_create.append({
            "name": "admin_1",
            "password": "admin_1",
            "avatar": ""
        })
        
        print(f"Creez {len(users_to_create)} utilizatori...")
        
        created_count = 0
        for user_data in users_to_create:
            user = await prisma.user.create(data=user_data)
            created_count += 1
            print(f"  ✓ Creat: {user.name} (ID: {user.id})")
        
        print(f"\n✅ S-au creat {created_count} utilizatori cu succes!")
        
        # Afișăm sumar
        all_users = await prisma.user.find_many()
        print(f"\n📊 Total utilizatori în baza de date: {len(all_users)}")
        
        print("\n👥 Lista completă de utilizatori:")
        for user in all_users:
            print(f"  ID: {user.id}, Name: {user.name}, Password: {user.password}")
            
    except Exception as e:
        print(f"❌ Eroare: {e}")
        raise
    finally:
        await prisma.disconnect()

if __name__ == "__main__":
    asyncio.run(populate_users())
