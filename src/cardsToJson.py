import json
import re

def parse_cards(file_path):
    cards = []
    current_type = None
    current_card_lines = []

    def add_card(lines):
        if not lines:
            return
        # Merge all lines into single text
        full_line = ' '.join(lines).strip()
        # Split first dash to get cost and rest as text
        match = re.match(r'^([\d,\s\w]+?)\s*-\s*(.+)$', full_line, re.DOTALL)
        if not match:
            print(f"Skipping invalid line: {full_line}")
            return
        cost = match.group(1).strip()
        text = match.group(2).strip()
        card = {
            "Name": "Placeholder",
            "Cost": cost,
            "Types": [current_type] if current_type else [],
            "Text": text
        }
        cards.append(card)

    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.rstrip()
            if not line:
                continue

            # Detect type header (no dash, does not start with digit)
            if '-' not in line and not line[0].isdigit():
                current_type = line
                continue

            # Detect if line starts a new card (line starts with digit)
            if re.match(r'^\d', line):
                if current_card_lines:
                    add_card(current_card_lines)
                    current_card_lines = []
                current_card_lines.append(line)
            else:
                # continuation of previous card, include lines like "Channel Air"
                current_card_lines.append(line)

        # Add last card
        if current_card_lines:
            add_card(current_card_lines)

    return cards

if __name__ == "__main__":
    input_file = "cards.txt"  # replace with your file
    cards = parse_cards(input_file)
    print(json.dumps(cards, indent=2, ensure_ascii=False))
