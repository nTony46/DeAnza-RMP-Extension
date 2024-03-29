![DAC_Logo_White](https://user-images.githubusercontent.com/62355475/181185643-93a97da0-5896-4141-bf72-fa00d17bf2b9.png)
#
# DeAnza-RMP-Extension
A Chrome Extension that displays the professors' ratings next to their name in the DeAnza Class Listings. Designed to help students plan and register for classes more efficiently.

# How to Download
RateMyProfessors is known for taking down extensions in the Chrome Store, so here is another way to download it.
1. Either use `git clone https://github.com/nTony46/DeAnza-RMP-Extension` on the command line to clone the repository or click the big green "Code" button ---> "Download ZIP" and extract the main folder.
2. Go to `chrome://extensions/` and enable "Developer mode"
3. Use the "Load Unpacked" button and add the main folder.

# Features
- Displays color-coded ratings next to the professors' names in the De Anza Class Listings site
- Clicking on the rating will open a new tab directly to the professor's RateMyProfessors page

![demo_gif](https://user-images.githubusercontent.com/62355475/181186058-e80db91a-24fb-4af4-9c82-a5ebc87367b3.gif)
# Technicals
- This extension fetches and parses RateMyProfessor's data of each professor from the school
- It then injects the data into the corresponding professor in the Class Listings site



