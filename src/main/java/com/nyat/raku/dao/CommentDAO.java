package com.nyat.raku.dao;

import com.nyat.raku.entity.Comment;

public interface CommentDAO {
    Comment create(Comment comment);

    Comment get(Integer id);

    void remove(Comment comment);
}
