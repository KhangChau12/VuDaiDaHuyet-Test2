class Player {
    constructor(id, name, role) {
        this.id = id;
        this.name = name;
        this.role = role;
        this.team = this.assignTeam(role);
        this.coins = 3;
        this.frustration = 0;
        this.wine = 0;
        this.chosen = 0; // Trường hợp Chí Phèo bị chọn 2 lần liền bởi Thị Nở
        this.chosenByThiNo = 0; // Đếm số lần liên tiếp bị Thị Nở chọn
        this.items = {
            "Rượu Đế": 0,
            "Cháo Hành": 0,
            "Giải Ách": 0,
            "Hồi Hương": 0,
            "Minh Oan": 0,
        }; // Các thẻ
        this.shutup = false; // Câm
        this.drunk = false; // Say
        this.alive = true; // Sống
    }

    assignTeam(role) {
        if (["Bá Kiến", "Lý Cường", "Bà Ba", "Cai Lệ"].includes(role)) { // Thêm Cai Lệ vào phe Quyền Thế
            return "Quyền Thế";
        } else if (
            [
                "Lão Hạc",
                "Thị Nở",
                "Ông Giáo",
                "Bà Cô của Thị Nở",
                "Binh Chức",
                "Dân thường",
            ].includes(role)
        ) {
            return "Công Lý";
        } else {
            return "Lang Thang";
        }
    }

    addCoins(amount) {
        this.coins += amount;
    }

    removeCoins(amount) {
        this.coins = Math.max(0, this.coins - amount);
    }

    addItem(item) {
        this.items[item]++;
    }

    removeItem(item) {
        this.items[item] = Math.max(0, this.items[item] - 1);
    }

    increaseFrustration(amount) {
        this.frustration += amount;
    }

    increaseWine(amount) {
        this.wine += amount;
    }

    mute() {
        this.shutup = true;
    }

    unmute() {
        this.shutup = false;
    }

    kill() {
        this.alive = false;
    }

    changeTeam(newTeam) {
        this.team = newTeam;
    }
    // Debug / info
    getStatus() {
        return {
            name: this.name,
            role: this.role,
            team: this.team,
            coins: this.coins,
            frustration: this.frustration,
            wine: this.wine,
            items: this.items,
            shutup: this.shutup,
            alive: this.alive,
        };
    }
}

export { Player };