import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
import json
# تبدیل کاراکترهای شعر به بردارهای عددی
def preprocess_poem(poem, char_to_int):
    return [char_to_int[char] for char in poem if char in char_to_int]

# مدل LSTM برای تولید موسیقی
class MusicGenerator(nn.Module):
    def __init__(self, input_size, hidden_size, output_size, num_layers=1):
        super(MusicGenerator, self).__init__()
        self.lstm = nn.LSTM(input_size, hidden_size, num_layers, batch_first=True)
        self.fc = nn.Linear(hidden_size, output_size)

    def forward(self, x):
        out, _ = self.lstm(x)
        out = self.fc(out)
        return out

# تعریف پارامترها
input_size = 1   # هر ورودی یک عدد (نمایش عددی از کاراکتر)
hidden_size = 128
output_size = 1  # خروجی یک عدد (نمایش عددی از نت موسیقی)
num_layers = 2
num_epochs = 100
learning_rate = 0.01

# داده‌های نمونه برای آموزش (شعر و نت‌های مربوطه)
poem = "منم که گوشه میخانه خانقاه من است"
notes = [60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77, 79, 81, 83, 84]

# ایجاد نقشه کاراکتر به عدد
chars = sorted(set(poem))
char_to_int = {char: i for i, char in enumerate(chars)}

# پیش‌پردازش شعر
input_data = preprocess_poem(poem, char_to_int)
input_data = torch.tensor(input_data, dtype=torch.float32).view(-1, 1, 1)

# آماده‌سازی داده‌های هدف (نت‌ها)
target_data = torch.tensor(notes[:len(input_data)], dtype=torch.float32).view(-1, 1, 1)

# تعریف مدل
model = MusicGenerator(input_size, hidden_size, output_size, num_layers)
criterion = nn.MSELoss()
optimizer = optim.Adam(model.parameters(), lr=learning_rate)

# آموزش مدل
for epoch in range(num_epochs):
    outputs = model(input_data)
    optimizer.zero_grad()
    loss = criterion(outputs, target_data)
    loss.backward()
    optimizer.step()

    if (epoch + 1) % 10 == 0:
        print(f'Epoch [{epoch + 1}/{num_epochs}], Loss: {loss.item():.4f}')

# تولید موسیقی جدید بر اساس شعر
def generate_music(model, poem, char_to_int, length=50):
    model.eval()
    input_data = preprocess_poem(poem, char_to_int)
    input_data = torch.tensor(input_data, dtype=torch.float32).view(-1, 1, 1)

    generated_notes = []
    with torch.no_grad():
        for _ in range(length):
            output = model(input_data)
            next_note = output[-1].item()
            generated_notes.append(next_note)
            input_data = torch.cat((input_data, output[-1].view(1, 1, 1)), dim=0)

    return generated_notes

# تولید موسیقی بر اساس شعر جدید
new_poem = "دعای پیر مغان ورد صبحگاه من است"
generated_music = generate_music(model, new_poem, char_to_int)




# نت‌های تولید شده
generated_notes = [60, 62, 64, 65, 67, 69, 71, 72]  # یا استفاده از نام نت‌ها مثل ['C4', 'D4', ...]

# ذخیره به فایل JSON
with open('generated_notes.json', 'w') as f:
    json.dump(generated_notes, f)
print("Generated Music Notes:", generated_music)