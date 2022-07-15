package com.cloudwise.lcap.test.udf;

import lombok.extern.slf4j.Slf4j;
import org.apache.calcite.schema.FunctionContext;

import java.util.ArrayList;
import java.util.List;


@Slf4j
public class MyPlusInitFunction {

    private List<String> initY = new ArrayList<>();

    public MyPlusInitFunction(FunctionContext fx) {
        final int parameterCount = fx.getParameterCount();
        for (int i = 0; i < parameterCount; i++) {
            if (fx.isArgumentConstant(i)) {
                String argumentValueAs = fx.getArgumentValueAs(i, String.class);
                initY.add(argumentValueAs);
                log.info("argument is constant and has value " + argumentValueAs);
            } else {
                log.info("argument is not constant");
            }
        }
    }

    public List<String> eval(String x,String y) {
        initY.add(x);
        initY.add(y);
        return initY;
    }
}
