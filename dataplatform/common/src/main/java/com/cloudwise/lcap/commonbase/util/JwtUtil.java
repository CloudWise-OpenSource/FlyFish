package com.cloudwise.lcap.commonbase.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTCreator;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.extern.slf4j.Slf4j;

import java.io.UnsupportedEncodingException;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static java.time.temporal.ChronoUnit.DAYS;

/**
 * 头部（header)
 * 其为载荷（payload)
 * 签证（signature)
 * 由三部分生成token
 * 3部分之间用“.”号做分隔。
 * <p>
 * 载荷就是存放有效信息的地方。基本上填2种类型数据
 * 1-标准中注册的声明的数据
 * 2-自定义数据
 * 由这2部分内部做base64加密。最张数据进入JWT的chaims里存放。
 * 标准中注册的声明 (建议但不强制使用)
 * iss: jwt签发者
 * sub: jwt所面向的用户
 * aud: 接收jwt的一方
 * exp: jwt的过期时间，这个过期时间必须要大于签发时间
 * nbf: 定义在什么时间之前，该jwt都是不可用的.
 * iat: jwt的签发时间
 * jti: jwt的唯一身份标识，主要用来作为一次性token,从而回避重放攻击。
 * 签证信息算法 sign如下：//base64UrlEncode(header) + "." + base64UrlEncode(payload)+ your-256-bit-secret
 * 例如
 * eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 * <p>
 * Jwt的头部承载两部分信息：
 * <p>
 * 声明类型，这里是jwt
 * 声明加密的算法 通常直接使用 HMAC SHA256
 * JWT里验证和签名使用的算法，可选择下面的。
 * JWS 算法名称 描述
 * HS256 HMAC256 HMAC with SHA-256
 * HS384 HMAC384 HMAC with SHA-384
 * HS512 HMAC512 HMAC with SHA-512
 * RS256 RSA256 RSASSA-PKCS1-v1_5 with SHA-256
 * RS384 RSA384 RSASSA-PKCS1-v1_5 with SHA-384
 * RS512 RSA512 RSASSA-PKCS1-v1_5 with SHA-512
 * ES256 ECDSA256 ECDSA with curve P-256 and SHA-256
 * ES384 ECDSA384 ECDSA with curve P-384 and SHA-384
 * ES512 ECDSA512 ECDSA with curve P-521 and SHA-512
 * <p>
 * withIssuer   iss: jwt签发者
 * withIssuedAt  signtime jwt的签发时间
 * withAudience  接收jwt的一方
 * withSubject  jwt所面向的用户
 * withJWTId  jwt的唯一身份标识，主要用来作为一次性token,从而回避重放攻击。
 * withNotBefore  //在该时间之前该jwt都是不可用的
 * withClaim  //payload 自定义信息通过 withClaim 方法进行添加
 *
 * @author guo
 */
@Slf4j
public class JwtUtil {
    public static String JWT_SECERT = "rewyest46ss";
    public static String JWT_ISSURE = "SERVICE";
    public static String subject = "token";
    public static String audience = "APP";
    public static String JWT_ID = "46s4-246q-4g57";
    public static Map<String, Object> header = new HashMap<>();
    public static final long EXPIRE = 43200000;

    static {
        header.put("alg", "HMAC256");
        header.put("type", "JWT");
    }

    /**
     * 用户自定义信息
     */
    public static String createToken(Map<String, String> claims,Date expiresAt) {
        JWTCreator.Builder builder = JWT.create().withHeader(header).withExpiresAt(expiresAt)
                .withIssuer(JWT_ISSURE).withIssuedAt(new Date())
                .withAudience(audience).withSubject(subject)
                .withJWTId(JWT_ID);

        if (null != claims && claims.size() > 0) {
            claims.forEach(builder::withClaim);
        }
        return builder.sign(Algorithm.HMAC256(JWT_SECERT));
    }

    public static Map<String, Claim> verifyToken(String token) {
        //通过密钥信息和签名的发布者的信息生成JWTVerifier (JWT验证类)
        JWTVerifier verifier = JWT.require(Algorithm.HMAC256(JWT_SECERT)).build();
        //通过JWTVerifier 的verify获取 token中的信息,仔细查看verify()方法，发现其中已经了AUDIENCE EXPIRES_AT ISSUED_AT ISSUER JWT_ID SUBJECT 等字段的验证.
        DecodedJWT jwt = verifier.verify(token);
        //验证通过后只需要返回自定义的负载信息(查看jwt.getClaims()，发现它包含所有的字段)
        return jwt.getClaims();
    }


    public static void main(String[] args) throws UnsupportedEncodingException {
        Map<String, String> claims = new HashMap<>();
        //claims.put("userId", "156543232");
        claims.put("url", "https://moss.chinatiye.cn/test/781828016.mp4");
        long timestamp = Instant.now().plus(7L * 50, DAYS).toEpochMilli();
        String token = createToken(claims,new Date(timestamp));

        log.info("=================token=============================");
        log.info("token:{}", token);
        log.info("=================token=============================");

        Map<String, Claim> stringClaimMap = verifyToken(token);

        log.info("=================verifyToken=============================");
        stringClaimMap.forEach((k, v) -> log.info("claims key:{},value:{}", k, v.asString()));
        log.info("=================verifyToken=============================");
    }
}
