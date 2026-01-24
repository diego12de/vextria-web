
try:
    with open('home.html', 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # We want to keep lines 1 to 14422 (indices 0 to 14421)
    # And lines 19091 to End (indices 19090 to End)
    # So we remove indices 14422 up to 19090 (exclusive of 19090? No, up to 19090 start point)
    # Python slice: [start:end] excludes end.
    
    # Prefix: lines[:14422] (0 to 14421)
    # Suffix: lines[19090:] (19090 to End)
    
    new_content = lines[:14422] + lines[19090:]
    
    with open('home.html', 'w', encoding='utf-8') as f:
        f.writelines(new_content)
        
    print(f"Successfully removed section. New line count: {len(new_content)}")

except Exception as e:
    print(f"Error: {e}")
