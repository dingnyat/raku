package com.nyat.raku.util;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CropData {
    private float scale;
    private int x, y, w, h, angle;
}