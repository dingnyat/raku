package com.nyat.raku.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nyat.raku.dao.TrackDAO;
import com.nyat.raku.entity.Track;
import com.nyat.raku.model.TrackDTO;
import com.nyat.raku.service.TrackService;
import com.nyat.raku.util.CropData;
import org.imgscalr.Scalr;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.List;

@Service
@Transactional
public class TrackServiceImpl implements TrackService {

    @Autowired
    private TrackDAO trackDAO;

    @Value("${raku.root-path}")
    private String storagePath;

    @Override
    public Track create(TrackDTO trackDTO) throws Exception {
        Track track = new Track();
        track.setTitle(trackDTO.getTitle());
        track.setCode(trackDTO.getCode());
        track.setComposer(trackDTO.getComposer());
        track.setDescription(trackDTO.getDescription());
        track.setPlays(0);
        track.setPrivacy(trackDTO.getPrivacy());
        if (trackDTO.getImage() != null) {
            trackDTO.setCropData((new ObjectMapper()).readValue(trackDTO.getCropDataStr(), CropData.class));
            BufferedImage originalImg = ImageIO.read(trackDTO.getImage().getInputStream());
            BufferedImage scaledImg = Scalr.resize(originalImg,
                    Scalr.Method.SPEED,
                    Scalr.Mode.AUTOMATIC,
                    (int) (originalImg.getWidth() * trackDTO.getCropData().getScale()),
                    (int) (originalImg.getHeight() * trackDTO.getCropData().getScale()));

            BufferedImage resultImg = scaledImg.getSubimage(trackDTO.getCropData().getX(), trackDTO.getCropData().getY(), trackDTO.getCropData().getW(), trackDTO.getCropData().getH());
            File file = new File(this.storagePath + File.separator + trackDTO.getCode() + ".jpg");
            ImageIO.write(resultImg, "jpg", file);
        }
        trackDAO.create(track);
        return track;
    }

    @Override
    public TrackDTO get(Integer id) {
        return null;
    }

    @Override
    public List<TrackDTO> getAll() {
        return null;
    }

    @Override
    public void update(TrackDTO trackDTO) {

    }

    @Override
    public void delete(Integer id) {

    }
}
