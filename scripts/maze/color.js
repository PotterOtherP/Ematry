class ColorRGB {
    
    constructor(red, green, blue)
    {
        this.r = red;
        this.g = green;
        this.b = blue;
    }

    getCode()
    {
        let rStr = this.r.toString(16);
        let gStr = this.g.toString(16);
        let bStr = this.b.toString(16);

        if (this.r < 0x10) rStr = "0" + rStr;
        if (this.g < 0x10) gStr = "0" + gStr;
        if (this.b < 0x10) bStr = "0" + bStr;

        return "#" + rStr + gStr + bStr;

    }
}