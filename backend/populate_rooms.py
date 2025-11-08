import asyncio
import json
from pathlib import Path
from prisma import Prisma

async def populate_rooms():
    """
    Populează tabela Room cu date din JSON-ul desk-layout.
    Pentru fiecare element din JSON, creează o înregistrare în Room
    unde câmpul 'data' conține întregul obiect JSON al elementului.
    """
    prisma = Prisma()
    await prisma.connect()
    
    try:
        # Citim JSON-ul
        json_path = Path("/home/luca/SmartHack/desk-layout (9) (2).json")
        
        if not json_path.exists():
            print(f"❌ Fișierul {json_path} nu a fost găsit!")
            return
        
        with open(json_path, 'r', encoding='utf-8') as f:
            rooms_data = json.load(f)
        
        print(f"📖 Am citit {len(rooms_data)} elemente din JSON")
        
        # Ștergem toate înregistrările existente
        deleted = await prisma.room.delete_many()
        print(f"🗑️  Am șters {deleted} înregistrări existente")
        
        # Resetăm contorul autoincrement în SQLite
        await prisma.execute_raw('DELETE FROM sqlite_sequence WHERE name = "Room";')
        print(f"🔄 Am resetat contorul autoincrement\n")
        
        print(f"Creez {len(rooms_data)} înregistrări Room...")
        
        created_count = 0
        for item in rooms_data:
            # Convertim întregul obiect JSON într-un string pentru câmpul 'data'
            room_data_str = json.dumps(item, ensure_ascii=False)
            
            room = await prisma.room.create(
                data={
                    "data": room_data_str
                }
            )
            created_count += 1
            
            # Afișăm progresul la fiecare 20 de înregistrări
            if created_count % 20 == 0:
                print(f"  ✓ Creat {created_count}/{len(rooms_data)} înregistrări...")
        
        print(f"\n✅ S-au creat {created_count} înregistrări cu succes!")
        
        # Afișăm un sumar
        all_rooms = await prisma.room.find_many()
        print(f"\n📊 Total înregistrări în tabela Room: {len(all_rooms)}")
        
        # Afișăm primele 3 înregistrări ca exemplu
        print("\n🔍 Primele 3 înregistrări (exemplu):")
        for i, room in enumerate(all_rooms[:3], 1):
            data_obj = json.loads(room.data)
            print(f"  {i}. ID DB: {room.id}, JSON ID: {data_obj.get('id')}, Name: {data_obj.get('name')}, Type: {data_obj.get('type')}")
            
    except Exception as e:
        print(f"❌ Eroare: {e}")
        raise
    finally:
        await prisma.disconnect()

if __name__ == "__main__":
    asyncio.run(populate_rooms())
