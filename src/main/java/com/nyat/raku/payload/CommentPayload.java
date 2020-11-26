package com.nyat.raku.payload;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(value = JsonInclude.Include.NON_NULL)
public class CommentPayload {
    private Integer trackId;
    private Integer replyCommentId;
    private String content;
}
