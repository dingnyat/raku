package com.nyat.raku.service.impl;

import com.nyat.raku.entity.User;
import com.nyat.raku.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.nio.charset.StandardCharsets;

@Service
public class EmailServiceImpl implements EmailService {

    private static final String USER = "user";

    private static final String BASE_URL = "baseUrl";

    @Value("${mail.base-url}")
    private String MAIL_BASE_URL;

    @Autowired
    private JavaMailSender emailSender;

    @Autowired
    private SpringTemplateEngine templateEngine;

    @Override
    public void sendVerificationEmail(User user) {
        sendEmailFromTemplate(user, "mail/verificationEmail", "Please verify your Raku account");
    }

    @Async
    public void sendEmailFromTemplate(User user, String templateName, String subject) {
        Context context = new Context();
        context.setVariable(USER, user);
        context.setVariable(BASE_URL, MAIL_BASE_URL);
        String content = templateEngine.process(templateName, context);
        sendEmail(user.getEmail(), subject, content, false, true);
    }

    @Async
    public void sendEmail(String to, String subject, String content, boolean isMultipart, boolean isHtml) {
        MimeMessage mimeMessage = emailSender.createMimeMessage();
        try {
            MimeMessageHelper message = new MimeMessageHelper(mimeMessage, isMultipart, StandardCharsets.UTF_8.name());
            message.setTo(to);
            message.setSubject(subject);
            message.setText(content, isHtml);
            emailSender.send(mimeMessage);
        } catch (MailException | MessagingException ignored) {
        }
    }
}
